from celery import Celery
from celery.schedules import crontab
from app.config import get_settings

settings = get_settings()

# Initialize Celery app
# Defaults to a Redis broker if available, otherwise runs locally for development
broker_url = "redis://localhost:6379/0"

celery_app = Celery(
    "subscio_tasks",
    broker=broker_url,
    backend=broker_url,
    include=["app.tasks"]
)

# Celery Beat Configuration
celery_app.conf.beat_schedule = {
    # Agent 2: Trigger the harvester every 15 minutes
    "agent-2-harvester-loop": {
        "task": "app.tasks.agent2_harvester_cron",
        "schedule": crontab(minute="*/15"),
    },
    # Agent 3: Trigger the intent analyzer every 5 minutes
    "agent-3-intent-loop": {
        "task": "app.tasks.agent3_intent_analyzer_task",
        "schedule": crontab(minute="*/5"),
    },
    # Agent 4: Trigger the score calculator every 5 minutes
    "agent-4-scoring-loop": {
        "task": "app.tasks.agent4_score_calculator_task",
        "schedule": crontab(minute="*/5"),
    },
    # Agent 5: Trigger the Corsair gateway every 5 minutes
    "agent-5-corsair-loop": {
        "task": "app.tasks.agent5_corsair_task",
        "schedule": crontab(minute="*/5"),
    },
}

celery_app.conf.timezone = "UTC"
