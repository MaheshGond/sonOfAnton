export const nodeTypes = {
  apiNode: ({ data }) => <div className="p-2 bg-blue-100 border rounded">API: {data.label}</div>,
  conditionNode: ({ data }) => <div className="p-2 bg-green-100 border rounded">Condition: {data.label}</div>,
  memoryNode: ({ data }) => <div className="p-2 bg-yellow-100 border rounded">Memory: {data.label}</div>,
  webhookNode: ({ data }) => <div className="p-2 bg-purple-100 border rounded">Webhook: {data.label}</div>,
  pauseNode: ({ data }) => <div className="p-2 bg-gray-100 border rounded">Pause: {data.label}</div>,
};


// File: components/FlowBuilderWrapper.jsx

import React from 'react';
import FlowBuilder from './FlowBuilder';
import { nodeTypes } from './CustomNodeTypes';

const FlowBuilderWrapper = () => {
  return (
    <FlowBuilder nodeTypes={nodeTypes} />
  );
};

export default FlowBuilderWrapper;
