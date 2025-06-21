import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Anton FlowForge"
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

settings = Settings()
