#!/bin/bash

# Create base backend structure (assuming you're inside the 'backend' folder)
mkdir -p agents flows utils schemas services core

# Create empty __init__.py files to make them Python packages
touch agents/__init__.py
touch flows/__init__.py
touch utils/__init__.py
touch schemas/__init__.py
touch services/__init__.py
touch core/__init__.py

# Create Dockerfile and requirements.txt if they don't exist
touch Dockerfile
touch requirements.txt

# Create core files
touch core/celery_app.py
touch core/config.py

# Create FastAPI entry point
touch main.py

# Create sample files
touch agents/sample_agent.py
touch flows/flow_manager.py
touch utils/common.py
touch schemas/flow_schema.py
touch services/agent_service.py

# Create .env file
touch .env

# Initial message
echo "✅ Backend folder structure and boilerplate files created successfully!"
