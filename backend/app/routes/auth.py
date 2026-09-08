"""
SUBSCIO — Authentication Routes
Handles registration and login.
"""
import hashlib
import secrets
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import UserORM, UserRegister, UserLogin, TokenResponse
from app.models.tenant import TenantORM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

router = APIRouter(prefix="/auth", tags=["Authentication"])

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required.")
    
    # In this prototype, the token is simply the user's email
    result = await db.execute(select(UserORM).filter(UserORM.email == token))
    user = result.scalars().first()
    
    # FALLBACK for older active sessions that still use the 64-char hex dummy token
    if not user and len(token) == 64:
        fallback = await db.execute(select(UserORM))
        user = fallback.scalars().first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")
    
    return user

def hash_password(password: str) -> str:
    """Very simple hash for prototype purposes."""
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    # 1. Check if email already exists
    result = await db.execute(select(UserORM).filter(UserORM.email == user_data.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    
    # 2. Create Tenant (Company)
    # Generate a slug from company name
    slug = "".join(c if c.isalnum() else "-" for c in user_data.company.lower())
    
    # NEW: Check if company slug already exists to prevent the database crash
    existing_tenant = await db.execute(select(TenantORM).filter(TenantORM.slug == slug))
    if existing_tenant.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This company is already registered. Please use a different company name or log in."
        )
        
    tenant = TenantORM(
        name=user_data.company, 
        slug=slug, 
        website_url=user_data.companyUrl,
        product_summary=user_data.companyDescription
    )
    db.add(tenant)
    await db.flush()  # To get tenant.id
    
    # 3. Create User
    full_name = "Admin" # Placeholder as name is no longer collected
    user = UserORM(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=full_name,
        tenant_id=tenant.id
    )
    db.add(user)
    await db.commit()
    
    # 4. Fire AI target generation immediately and save to database
    from app.services.ai_service import get_ai_service
    from app.models.target_profile import TargetProfileORM
    import uuid
    from app.tasks import execute_sequential_pipeline_loop
    
    # Helper for background backfill
    async def _run_backfill_background(org_id: str, targets_data: list, seller_company: str = "", seller_products: str = ""):
        from app.database import _get_session_factory
        from app.services.harvester import fetch_historical_backfill
        from app.tasks import execute_sequential_pipeline_loop
        factory = _get_session_factory()
        if not factory: return
        async with factory() as session:
            for target_data in targets_data:
                company_name = target_data.get("company_name", "Unknown Target")
                search_terms = target_data.get("search_terms", "")
                try:
                    await fetch_historical_backfill(
                        session=session,
                        org_id=org_id,
                        company_name=company_name,
                        search_terms=search_terms,
                        seller_company=seller_company,
                        seller_products=seller_products
                    )
                    await session.commit()
                except Exception as e:
                    await session.rollback()
                    print(f"Background backfill error: {e}")
        # Run pipeline loop to score any newly backfilled signals
        try:
            await execute_sequential_pipeline_loop(org_id)
        except Exception as e:
            print(f"Post-backfill pipeline loop error: {e}")
    
    ai = get_ai_service()
    try:
        # Call async generate_targets with seller company and description
        targets = await ai.generate_targets(
            company_url=user_data.companyUrl,
            company_name=user_data.company,
            company_description=user_data.companyDescription
        )
        print(f"Generated targets during registration: {targets}")
        
        for target_data in targets:
            company_name = target_data.get("company_name", "Unknown Target")
            industry = target_data.get("industry", "AI Discovered Target")
            search_terms = target_data.get("search_terms", "")
            
            new_target = TargetProfileORM(
                id=str(uuid.uuid4()),
                org_id=str(tenant.id),
                name=company_name,
                description=industry,
                search_terms=search_terms,
                status="discovered"
            )
            db.add(new_target)
            
        await db.commit()
        
        # Trigger background backfill for Day-Zero
        background_tasks.add_task(
            _run_backfill_background,
            str(tenant.id),
            targets,
            user_data.company,
            user_data.companyDescription
        )
        
        # Trigger the downstream pipeline via FastAPI BackgroundTasks
        background_tasks.add_task(execute_sequential_pipeline_loop, str(tenant.id))
    except Exception as e:
        print(f"Failed to generate targets during registration: {e}")
    
    # 5. Use email as token for this prototype
    token = user.email
    return TokenResponse(access_token=token, user_name=full_name)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    # 1. Find user by email
    result = await db.execute(select(UserORM).filter(UserORM.email == credentials.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    # 2. Verify password
    if user.password_hash != hash_password(credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    # 3. Use email as token for this prototype
    token = user.email
    return TokenResponse(access_token=token, user_name=user.name)

@router.delete("/delete-account")
async def delete_account(current_user: UserORM = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    tenant_id = current_user.tenant_id
    user_id = current_user.id
    
    from sqlalchemy import delete
    from app.models.signal import SignalORM
    from app.models.lead import LeadORM
    from app.models.target_profile import TargetProfileORM
    from app.models.tenant import TenantORM
    
    # Execute strict cascading wipe in a single transaction
    await db.execute(delete(LeadORM).where(LeadORM.org_id == str(tenant_id)))
    await db.execute(delete(SignalORM).where(SignalORM.org_id == str(tenant_id)))
    await db.execute(delete(TargetProfileORM).where(TargetProfileORM.org_id == str(tenant_id)))
    await db.execute(delete(UserORM).where(UserORM.id == user_id))
    await db.execute(delete(TenantORM).where(TenantORM.id == tenant_id))

    await db.commit()
    return {"status": "success", "message": "Account and associated data deleted successfully."}


from typing import Optional

class ProfileUpdateRequest(BaseModel):
    company_name: Optional[str] = None
    website_url: Optional[str] = None
    phone_number: Optional[str] = None
    company_description: Optional[str] = None
    logo_url: Optional[str] = None
    username: Optional[str] = None

@router.get("/me")
async def get_me(current_user: UserORM = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TenantORM).filter(TenantORM.id == current_user.tenant_id))
    tenant = result.scalars().first()
    
    if not tenant:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    return {
        "profile": {
            "org_id": tenant.id,
            "company_name": tenant.name,
            "phone_number": tenant.phone_number,
            "company_description": tenant.product_summary,
            "website_url": tenant.website_url,
            "logo_url": tenant.logo_url,
            "username": current_user.name,
            "email": current_user.email
        }
    }

@router.put("/profile")
async def update_profile(
    profile_data: ProfileUpdateRequest,
    current_user: UserORM = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update company details for the authenticated user."""
    result = await db.execute(select(TenantORM).filter(TenantORM.id == current_user.tenant_id))
    tenant = result.scalars().first()

    if not tenant:
        raise HTTPException(status_code=404, detail="Organization not found")

    if profile_data.company_name is not None:
        tenant.name = profile_data.company_name
    if profile_data.phone_number is not None:
        tenant.phone_number = profile_data.phone_number
    if profile_data.company_description is not None:
        tenant.product_summary = profile_data.company_description
    if profile_data.website_url is not None:
        tenant.website_url = profile_data.website_url
    if profile_data.logo_url is not None:
        tenant.logo_url = profile_data.logo_url

    if profile_data.username is not None:
        current_user.name = profile_data.username

    await db.commit()
    await db.refresh(tenant)
    await db.refresh(current_user)

    return {
        "message": "Profile updated successfully.",
        "profile": {
            "org_id": tenant.id,
            "company_name": tenant.name,
            "phone_number": tenant.phone_number,
            "company_description": tenant.product_summary,
            "website_url": tenant.website_url,
            "logo_url": tenant.logo_url,
            "username": current_user.name,
            "email": current_user.email
        }
    }

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

@router.put("/change-password")
async def change_password(
    data: PasswordChangeRequest,
    current_user: UserORM = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.password_hash != hash_password(data.current_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    current_user.password_hash = hash_password(data.new_password)
    await db.commit()

    return {"status": "success", "message": "Password updated successfully."}
