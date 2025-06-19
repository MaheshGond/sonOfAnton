// frontend/src/pages/FlowBuilder.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PlayCircle, Zap, MessageSquare, Home } from 'lucide-react';

// --- Custom Node Components ---
const StartNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-emerald-600 min-w-[120px]">
    <PlayCircle size={20} className="mr-2" />
    <div className="text-sm font-semibold">{data.label}</div>
  </div>
);

const ProcessNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-lg bg-blue-500 text-white flex items-center justify-center border-2 border-blue-600 min-w-[120px]">
    <Zap size={20} className="mr-2" />
    <div className="text-sm font-semibold">{data.label}</div>
  </div>
);

const MessageNode = ({ data }) => (
  <div className="px-4 py-2 shadow-md rounded-lg bg-purple-500 text-white flex items-center justify-center border-2 border-purple-600 min-w-[120px]">
    <MessageSquare size={20} className="mr-2" />
    <div className="text-sm font-semibold">{data.label}</div>
  </div>
);

const nodeTypes = {
  startNode: StartNode,
  processNode: ProcessNode,
  messageNode: MessageNode,
};

let id = 0; // Simple ID counter for new nodes
const getId = () => `dndnode_${id++}`;

const FlowBuilder = ({ currentFlow, saveFlow, user, onBackToDashboard }) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [flowName, setFlowName] = useState('New Flow');
  const [message, setMessage] = useState('');

  // Update nodes and edges when currentFlow changes (e.g., when loading a flow)
  useEffect(() => {
    if (currentFlow) {
      setNodes(currentFlow.nodes || []);
      setEdges(currentFlow.edges || []);
      setFlowName(currentFlow.name || 'New Flow');
      // Ensure IDs continue from the largest existing ID
      id = (currentFlow.nodes || []).length > 0
        ? Math.max(...currentFlow.nodes.map(n => parseInt(n.id.replace('dndnode_', '') || '0'))) + 1
        : 0;
    } else {
      setNodes([]);
      setEdges([]);
      setFlowName('New Flow');
      id = 0; // Reset ID counter for a new flow
    }
  }, [currentFlow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type.replace('Node', '')} Node` },
        className: `border-2 ${
          type === 'startNode' ? 'border-emerald-600' :
          type === 'processNode' ? 'border-blue-600' :
          type === 'messageNode' ? 'border-purple-600' : ''
        }`,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSaveFlow = async () => {
    if (!flowName.trim()) {
      setMessage('Flow name cannot be empty!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    const flowData = {
      // Use current flow's flowId if editing, otherwise generate a new one
      flowId: currentFlow?.flowId || `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: flowName,
      nodes,
      edges,
      userId: user.uid, // Ensure user ID is passed for backend association
    };
    try {
      await saveFlow(flowData);
      setMessage('Flow saved successfully!');
    } catch (error) {
      console.error('Error saving flow:', error);
      setMessage('Failed to save flow.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-inter bg-gray-50">
      {/* Top Bar for Flow Name and Save */}
      <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-md z-10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            title="Back to Dashboard"
          >
            <Home size={20} />
          </button>
          <input
            type="text"
            className="text-xl font-bold text-gray-800 border-b-2 border-transparent focus:border-blue-500 outline-none p-1 bg-transparent"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
            placeholder="Flow Name"
          />
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800 animate-fade-in-out">
              {message}
            </span>
          )}
          <button
            onClick={handleSaveFlow}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center"
          >
            Save Flow
          </button>
        </div>
      </div>

      {/* Sidebar for draggable nodes */}
      <aside className="w-full md:w-64 bg-gray-100 p-4 border-b md:border-r border-gray-300 flex flex-col items-center shadow-lg pt-20 md:pt-4">
        <h2 className="text-xl font-bold mb-6 text-gray-800 hidden md:block">Nodes</h2>
        <div
          className="draggable-node mb-4 p-3 rounded-lg bg-emerald-400 text-white shadow-md cursor-grab active:cursor-grabbing hover:bg-emerald-500 transition-colors duration-200 w-full text-center flex items-center justify-center transform hover:scale-105"
          onDragStart={(event) => onDragStart(event, 'startNode')}
          draggable
        >
          <PlayCircle size={20} className="mr-2" />
          Start Node
        </div>
        <div
          className="draggable-node mb-4 p-3 rounded-lg bg-blue-400 text-white shadow-md cursor-grab active:cursor-grabbing hover:bg-blue-500 transition-colors duration-200 w-full text-center flex items-center justify-center transform hover:scale-105"
          onDragStart={(event) => onDragStart(event, 'processNode')}
          draggable
        >
          <Zap size={20} className="mr-2" />
          Process Node
        </div>
        <div
          className="draggable-node mb-4 p-3 rounded-lg bg-purple-400 text-white shadow-md cursor-grab active:cursor-grabbing hover:bg-purple-500 transition-colors duration-200 w-full text-center flex items-center justify-center transform hover:scale-105"
          onDragStart={(event) => onDragStart(event, 'messageNode')}
          draggable
        >
          <MessageSquare size={20} className="mr-2" />
          Message Node
        </div>
        <div className="mt-auto text-sm text-gray-600 hidden md:block">
          Drag these nodes to the canvas
        </div>
      </aside>

      {/* Main React Flow Canvas */}
      <div className="flex-grow h-full pt-16 md:pt-0" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls className="!rounded-lg !shadow-lg" />
            <Background color="#eee" gap={16} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowBuilder;
