from celery import Celery

celery_app = Celery(
    'worker',
    broker='redis://redis:6379/0',
    backend='redis://redis:6379/0'
)

celery_app.autodiscover_tasks(['agents'])  # This will automatically discover tasks in agents/tasks.py
