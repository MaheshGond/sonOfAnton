import React from 'react';

// Define all node configuration schemas here
const nodeConfigSchema = {
  SymptomChecker: [
    { label: 'Symptom List', name: 'symptomList', type: 'text', placeholder: 'e.g. cough, fever' },
  ],
  PersonalizedTutor: [
    { label: 'Subject', name: 'subject', type: 'text', placeholder: 'e.g. Math, Science' },
  ],
  LeadNurturer: [
    { label: 'Lead Source', name: 'leadSource', type: 'text', placeholder: 'e.g. Website, Email' },
  ],
  ResumeScreener: [
    { label: 'Keywords', name: 'keywords', type: 'text', placeholder: 'e.g. JavaScript, React' },
  ],
  DocumentSummarizer: [
    { label: 'Summary Length', name: 'summaryLength', type: 'number', placeholder: 'e.g. 100' },
  ],
  ChatbotAssistant: [
    { label: 'Greeting Message', name: 'greeting', type: 'text', placeholder: 'e.g. Hi, how can I help you?' },
  ],
  // Add more agents as needed
};

const NodeConfigPanel = ({ selectedNode, updateNodeData }) => {
  const { label, type, config } = selectedNode.data;

  const schema = nodeConfigSchema[type];

  const handleInputChange = (e) => {
    updateNodeData(selectedNode.id, {
      ...selectedNode.data,
      config: { ...config, [e.target.name]: e.target.value },
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{label} Configuration</h2>
      {schema ? (
        <div className="space-y-4">
          {schema.map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={config[field.name] || ''}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className="border p-2 w-full rounded"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No specific configuration for this agent.</div>
      )}
    </div>
  );
};

export default NodeConfigPanel;
