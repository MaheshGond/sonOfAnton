import React from 'react';

const NodeConfigPanel = ({ selectedNode, updateNodeData }) => {
  if (!selectedNode) {
    return <div className="p-4 text-gray-500">Select a node to configure</div>;
  }

  const { label, type, config } = selectedNode.data;

  const handleChange = (field, value) => {
    updateNodeData(selectedNode.id, {
      ...selectedNode.data,
      config: {
        ...selectedNode.data.config,
        [field]: value,
      },
    });
  };

  return (
    <div className="p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-lg font-bold mb-2">Node Configuration</h2>

      {/* Common Label Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => updateNodeData(selectedNode.id, { ...selectedNode.data, label: e.target.value })}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Dynamic Configurations */}
      {type === 'inputNode' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Text / File URL</label>
          <input
            type="text"
            value={config?.input || ''}
            onChange={(e) => handleChange('input', e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      )}

      {type === 'videoSummarizerNode' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <input
            type="text"
            value={config?.videoUrl || ''}
            onChange={(e) => handleChange('videoUrl', e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      )}

      {type === 'newsNode' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={config?.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Topics</label>
            <input
              type="text"
              value={config?.topics || ''}
              onChange={(e) => handleChange('topics', e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        </>
      )}

      {type === 'emailAlertNode' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={config?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label>
            <input
              type="text"
              value={config?.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        </>
      )}

      {/* Add more node types as needed */}
    </div>
  );
};

export default NodeConfigPanel;
