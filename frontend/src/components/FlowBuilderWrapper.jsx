import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Importing local components
import Sidebar from '../components/Sidebar'; // Path adjusted
import NodeConfigPanel from '../components/NodeConfigPanel'; // Path adjusted
import CustomNode from '../components/CustomNode'; // Path adjusted

// Importing Lucide icons (already defined in Sidebar, but needed here for iconMap)
import {
  Video, Mail, FileText, MessageCircle, Bot, PlayCircle, Database, Send, User, Book, Briefcase, Search, ClipboardList, Film, AlertCircle, Globe, Heart, Smile, TrendingUp, FormInput, Newspaper
} from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

// Moved iconMap and labelMap here as they are directly used by FlowBuilderWrapper
const iconMap = {
  SymptomChecker: <AlertCircle className="w-4 h-4" />,
  PersonalizedTutor: <Book className="w-4 h-4" />,
  LeadNurturer: <Send className="w-4 h-4" />,
  ResumeScreener: <ClipboardList className="w-4 h-4" />,
  DocumentSummarizer: <FileText className="w-4 h-4" />,
  ChatbotAssistant: <MessageCircle className="w-4 h-4" />,
  DonorOutreach: <Heart className="w-4 h-4" />,
  IncidentResponse: <Bot className="w-4 h-4" />,
  ContentCurator: <Newspaper className="w-4 h-4" />,
  OnboardingGuide: <User className="w-4 h-4" />,
  VideoSummarizer: <Film className="w-4 h-4" />,
  DocumentChatCompanion: <MessageCircle className="w-4 h-4" />,
  PromptEmailAgent: <Mail className="w-4 h-4" />,
  PersonalizedNews: <Globe className="w-4 h-4" />,
  LifeImpactNews: <TrendingUp className="w-4 h-4" />,
  SocialResponder: <Smile className="w-4 h-4" />,
  AutoCRMUpdater: <Database className="w-4 h-4" />,
  GrantApplicationAgent: <Search className="w-4 h-4" />,
  PersonalNewsDigest: <Newspaper className="w-4 h-4" />,
  DocumentAutoFiller: <FormInput className="w-4 h-4" />,
  Input: <Video className="w-4 h-4" />,
  Output: <Mail className="w-4 h-4" />,
  Trigger: <PlayCircle className="w-4 h-4" />,
};

const labelMap = {
  SymptomChecker: 'Symptom Checker AI',
  PersonalizedTutor: 'Personalized Tutor AI',
  LeadNurturer: 'Lead Nurturer AI',
  ResumeScreener: 'Resume Screener AI',
  DocumentSummarizer: 'Document Summarizer AI',
  ChatbotAssistant: 'Chatbot Assistant AI',
  DonorOutreach: 'Donor Outreach AI',
  IncidentResponse: 'Incident Response AI',
  ContentCurator: 'Content Curator AI',
  OnboardingGuide: 'Onboarding Guide AI',
  VideoSummarizer: 'Video Summarizer AI',
  DocumentChatCompanion: 'Document Chat Companion AI',
  PromptEmailAgent: 'Prompt-to-Email Alert Agent',
  PersonalizedNews: 'Personalized Impact News Filter AI',
  LifeImpactNews: 'Life-Impact News Delivery Agent',
  SocialResponder: 'Social Media Comment Responder',
  AutoCRMUpdater: 'Auto-CRM Updater Agent',
  GrantApplicationAgent: 'AI-Based Grant Application Agent',
  PersonalNewsDigest: 'Personal News Digest Builder',
  DocumentAutoFiller: 'Document-to-Form Auto Filler Agent',
  Input: 'Input Node',
  Output: 'Output Node',
  Trigger: 'Trigger Node',
};


const FlowBuilderWrapper = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null); // State to hold the ReactFlow instance
  const [selectedNode, setSelectedNode] = useState(null);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      // Ensure reactFlowInstance is available before using it
      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Correctly convert screen coordinates to flow coordinates using reactFlowInstance
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}_${+new Date()}`,
        type: 'custom', // All custom nodes use the 'custom' type defined in nodeTypes
        position,
        data: {
          label: labelMap[type] || type,
          icon: iconMap[type],
          type, // Store the original type for identification and configuration
          config: {}, // Initialize with empty config
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes] // Add reactFlowInstance to dependencies
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node))
    );
    setSelectedNode(prev => (prev && prev.id === nodeId ? { ...prev, data: newData } : prev));
  }, [setNodes]);

  const handleImport = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        const data = JSON.parse(fileReader.result);
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
        } else {
          // Changed alert to console.error + div message for better UX
          console.error('Invalid flow file: Missing nodes or edges property.');
          // Optionally show a message on UI for user
        }
      } catch (error) {
        console.error('Error reading file:', error);
        // Optionally show a message on UI for user
      }
    };
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0]);
    }
  };

  const handleExport = () => {
    const data = {
      nodes,
      edges,
    };
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  const handleSave = () => {
    localStorage.setItem('savedFlow', JSON.stringify({ nodes, edges }));
    console.log('Flow saved locally.');
    // In a real application, you'd show a user-friendly message
  };

  const handleSchedule = () => {
    console.log('Scheduling feature to be implemented.');
    // In a real application, you'd show a user-friendly message
  };

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Delete' && selectedNode) {
        setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
        setEdges((eds) =>
          eds.filter(
            (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
          )
        );
        setSelectedNode(null);
      }
    },
    [selectedNode, setNodes, setEdges]
  );

  return (
    <ReactFlowProvider>
      <div
        className="flex h-screen w-screen overflow-hidden"
        onKeyDown={onKeyDown}
        tabIndex={0} // Make div focusable for keydown events
      >
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4 shadow-lg overflow-y-auto h-screen">
          <Sidebar />
        </div>

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 relative bg-white">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance} // Set the ReactFlow instance here
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>

          <div className="absolute top-4 right-4 space-x-2 z-10"> {/* Ensure buttons are above canvas */}
            <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded">Export</button>

            {/* Import File Input (Hidden) */}
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
              id="importFile"
            />

            {/* Import Button */}
            <label htmlFor="importFile" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
              Import
            </label>

            <button onClick={handleSave} className="bg-yellow-500 text-white px-4 py-2 rounded">Save</button>
            <button onClick={handleSchedule} className="bg-purple-500 text-white px-4 py-2 rounded">Schedule</button>
          </div>
        </div>

        {/* Node Config Panel */}
        <div className="w-72 bg-white p-4 shadow-lg border-l overflow-y-auto h-screen">
          {selectedNode ? (
            <NodeConfigPanel
              selectedNode={selectedNode}
              updateNodeData={updateNodeData}
            />
          ) : (
            <div className="text-gray-500">Select a node to configure</div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowBuilderWrapper;
