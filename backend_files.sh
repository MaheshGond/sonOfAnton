#!/bin/bash

# Create base backend structure
mkdir -p backend/{agents,flows,utils,schemas,services,core}

# Create empty __init__.py files to make them Python packages
touch backend/{agents,flows,utils,schemas,services,core}/__init__.py

# Create Dockerfile and requirements.txt
touch backend/Dockerfile
touch backend/requirements.txt

# Create core files
touch backend/core/{celery_app.py,config.py}

# Create FastAPI entry point
touch backend/main.py

# Create sample files
touch backend/agents/sample_agent.py
touch backend/flows/flow_manager.py
touch backend/utils/common.py
touch backend/schemas/flow_schema.py
touch backend/services/agent_service.py

# Create .env file
touch backend/.env

# Initial message
echo "✅ Backend folder structure and boilerplate files created successfully!"
