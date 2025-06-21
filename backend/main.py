from fastapi import FastAPI
from celery_app import celery_app
from celery.result import AsyncResult

app = FastAPI()

@app.post("/run-task/")
def run_task(x: int, y: int):
    task = celery_app.send_task('agents.example_task', args=[x, y])
    return {"task_id": task.id}

@app.get("/task-status/{task_id}")
def get_task_status(task_id: str):
    result = celery_app.AsyncResult(task_id)
    return {"task_id": task_id, "status": result.status, "result": result.result}


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running successfully!"}

@app.get("/")
def read_root():
    return {"message": "API is running"}