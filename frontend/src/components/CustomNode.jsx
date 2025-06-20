// CustomNode.jsx
import React from 'react';
import { Handle } from 'reactflow';

const CustomNode = ({ data }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow flex items-center">
      <div className="mr-2">{data.icon}</div>
      <div className="font-medium">{data.label}</div>

      {/* Optional Handles for connecting nodes */}
      <Handle type="target" position="top" style={{ background: '#555' }} />
      <Handle type="source" position="bottom" style={{ background: '#555' }} />
    </div>
  );
};

export default CustomNode;
