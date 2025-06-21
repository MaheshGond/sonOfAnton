from celery_app import celery_app

# This file just needs to expose the Celery app for the worker process.
# Run this with: celery -A worker.celery_app worker --loglevel=info
