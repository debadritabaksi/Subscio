import os
import requests
from dotenv import load_dotenv

def run_diagnostic():
    print("--- GROQ API KEY DIAGNOSTIC REPORT ---")
    
    # a. Explicitly load .env
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(f"Location: Found .env at {env_path}")
    else:
        print(f"Location: .env file NOT FOUND at {env_path}")
        
    # b. Extract GROQ_API_KEY
    groq_key_raw = os.environ.get("GROQ_API_KEY", None)
    
    if groq_key_raw is None:
        print("Format: GROQ_API_KEY is missing from environment.")
        return
        
    print("Format: GROQ_API_KEY found in environment.")
    
    # d. Analyze string format
    groq_key = groq_key_raw.strip()
    
    if groq_key != groq_key_raw:
        print("Format Warning: Accidental leading or trailing whitespaces detected.")
        
    if groq_key.startswith('"') and groq_key.endswith('"') or groq_key.startswith("'") and groq_key.endswith("'"):
        print("Format Warning: Key is wrapped in quotes. This may cause authorization failure if passed verbatim.")
        groq_key = groq_key.strip("\"'")
        
    if groq_key.startswith("gsk_"):
        print("Format Check: Passed (starts with 'gsk_').")
    else:
        print("Format Warning: Key does NOT start with 'gsk_'. This might be an invalid or older key.")
        
    # e. Execute GET request
    print("\nExecuting live authorization test...")
    url = "https://api.groq.com/openai/v1/models"
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        status_code = response.status_code
        print(f"Live Authorization Status Code: {status_code}")
        
        if status_code == 200:
            print("Live Authorization: OK (Authorized).")
        elif status_code == 401:
            print("Live Authorization: FAILED (401 Unauthorized - Invalid Key).")
        else:
            print(f"Live Authorization: UNEXPECTED STATUS ({status_code}).")
            
    except Exception as e:
        print(f"Live Authorization: FAILED due to network error ({e})")

if __name__ == "__main__":
    run_diagnostic()
