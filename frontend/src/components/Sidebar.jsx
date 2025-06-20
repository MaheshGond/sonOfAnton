// Sidebar.jsx
import React from "react";
import { Video, Mail, FileText, MessageCircle, Bot, PlayCircle, Database, Send, User, Book, Briefcase, Search, ClipboardList, Film, AlertCircle, Globe, Heart, Smile, TrendingUp, FormInput, Newspaper } from "lucide-react";

const agentGroups = [
  {
    title: "🎯 Core Agents",
    agents: [
      { type: "SymptomChecker", label: "Symptom Checker AI", icon: <AlertCircle className="w-4 h-4 mr-2" /> },
      { type: "PersonalizedTutor", label: "Personalized Tutor AI", icon: <Book className="w-4 h-4 mr-2" /> },
      { type: "LeadNurturer", label: "Lead Nurturer AI", icon: <Send className="w-4 h-4 mr-2" /> },
      { type: "ResumeScreener", label: "Resume Screener AI", icon: <ClipboardList className="w-4 h-4 mr-2" /> },
      { type: "DocumentSummarizer", label: "Document Summarizer AI", icon: <FileText className="w-4 h-4 mr-2" /> },
      { type: "ChatbotAssistant", label: "Chatbot Assistant AI", icon: <MessageCircle className="w-4 h-4 mr-2" /> },
      { type: "DonorOutreach", label: "Donor Outreach AI", icon: <Heart className="w-4 h-4 mr-2" /> },
      { type: "IncidentResponse", label: "Incident Response AI", icon: <Bot className="w-4 h-4 mr-2" /> },
      { type: "ContentCurator", label: "Content Curator AI", icon: <Newspaper className="w-4 h-4 mr-2" /> },
      { type: "OnboardingGuide", label: "Onboarding Guide AI", icon: <User className="w-4 h-4 mr-2" /> },
    ],
  },
  {
    title: "🎬 Media & Communication",
    agents: [
      { type: "VideoSummarizer", label: "Video Summarizer AI", icon: <Film className="w-4 h-4 mr-2" /> },
      { type: "DocumentChatCompanion", label: "Document Chat Companion AI", icon: <MessageCircle className="w-4 h-4 mr-2" /> },
      { type: "PromptEmailAgent", label: "Prompt-to-Email Alert Agent", icon: <Mail className="w-4 h-4 mr-2" /> },
    ],
  },
  {
    title: "🌐 News & Personalization",
    agents: [
      { type: "PersonalizedNews", label: "Personalized Impact News Filter AI", icon: <Globe className="w-4 h-4 mr-2" /> },
      { type: "LifeImpactNews", label: "Life-Impact News Delivery Agent", icon: <TrendingUp className="w-4 h-4 mr-2" /> },
    ],
  },
  {
    title: "⚡ Market-Edge Agents",
    agents: [
      { type: "SocialResponder", label: "Social Media Comment Responder", icon: <Smile className="w-4 h-4 mr-2" /> },
      { type: "AutoCRMUpdater", label: "Auto-CRM Updater Agent", icon: <Database className="w-4 h-4 mr-2" /> },
      { type: "GrantApplicationAgent", label: "AI-Based Grant Application Agent", icon: <Search className="w-4 h-4 mr-2" /> },
      { type: "PersonalNewsDigest", label: "Personal News Digest Builder", icon: <Newspaper className="w-4 h-4 mr-2" /> },
      { type: "DocumentAutoFiller", label: "Document-to-Form Auto Filler Agent", icon: <FormInput className="w-4 h-4 mr-2" /> },
    ],
  },
  {
    title: "🛠️ Generic Nodes",
    agents: [
      { type: "Input", label: "Input Node", icon: <Video className="w-4 h-4 mr-2" /> },
      { type: "Output", label: "Output Node", icon: <Mail className="w-4 h-4 mr-2" /> },
      { type: "Trigger", label: "Trigger Node", icon: <PlayCircle className="w-4 h-4 mr-2" /> },
    ],
  },
];

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Agents</h2>
      {agentGroups.map((group) => (
        <div key={group.title} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{group.title}</h3>
          {group.agents.map((node) => (
            <div
              key={node.type}
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
              className="flex items-center p-2 mb-2 bg-white rounded shadow cursor-move hover:bg-gray-200"
            >
              {node.icon}
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
