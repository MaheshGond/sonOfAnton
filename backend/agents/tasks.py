from celery_app import celery_app

@celery_app.task(name='agents.example_task')
def example_task(x, y):
    return x + y
