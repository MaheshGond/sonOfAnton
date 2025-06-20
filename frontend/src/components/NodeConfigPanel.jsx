import React from 'react';

const NodeConfigPanel = ({ selectedNode, updateNodeData, onDeleteNode }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateNodeData(selectedNode.id, { ...selectedNode.data, [name]: value });
  };

  const renderFields = () => {
    switch (selectedNode.data.type) {
      case 'Input':
        return (
          <>
            <label>Input Source</label>
            <input
              name="source"
              value={selectedNode.data.source || ''}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
          </>
        );
      case 'Summarizer':
        return (
          <>
            <label>Summary Length</label>
            <input
              name="summaryLength"
              type="number"
              value={selectedNode.data.summaryLength || 100}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
          </>
        );
      case 'Email':
        return (
          <>
            <label>Email Address</label>
            <input
              name="email"
              value={selectedNode.data.email || ''}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />
          </>
        );
      default:
        return <div>No configuration needed.</div>;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Node Configuration</h3>
      <label>Label</label>
      <input
        name="label"
        value={selectedNode.data.label}
        onChange={handleChange}
        className="border p-2 mb-4 w-full"
      />
      {renderFields()}
      <button
        onClick={() => onDeleteNode(selectedNode.id)}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Delete Node
      </button>
    </div>
  );
};

export default NodeConfigPanel;
