#!/bin/bash

# Create directories
mkdir -p public
mkdir -p src/components

# Create files
touch public/index.html
touch src/components/FlowBuilder.jsx
touch src/components/Sidebar.jsx
touch src/components/CustomNodeTypes.js
touch src/components/FlowBuilderWrapper.jsx
touch src/components/NodeConfigPanel.jsx
touch src/components/ExecutionControls.jsx
touch src/components/LogConsole.jsx
touch src/App.jsx
touch src/main.jsx
touch src/api.js
touch src/utils.js
touch src/styles.css
touch package.json
touch tailwind.config.js
touch postcss.config.js
touch vite.config.js
touch README.md

echo "✅ Frontend folder structure and files created successfully!"
