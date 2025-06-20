import React, { useCallback, useState, useRef } from 'react';
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

import Sidebar from './Sidebar';
import NodeConfigPanel from './NodeConfigPanel';
import CustomNode from './CustomNode';

import {
  Video,
  Mail,
  FileText,
  MessageCircle,
  Bot,
  PlayCircle,
  Database,
  Send,
  User,
  Book,
  Briefcase,
  Search,
  ClipboardList,
  Film,
  AlertCircle,
  Globe,
  Heart,
  Smile,
  TrendingUp,
  FormInput,
  Newspaper,
} from 'lucide-react';

const nodeTypes = {
  custom: CustomNode,
};

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
  const [selectedNode, setSelectedNode] = useState(null);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}_${+new Date()}`,
        type: 'custom',
        position,
        data: {
          label: labelMap[type] || type,
          icon: iconMap[type],
          type,
          config: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data: newData } : node))
    );
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
        tabIndex={0}
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
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>

          <div className="absolute top-4 right-4 space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Export</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Import</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">Save</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded">Schedule</button>
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
