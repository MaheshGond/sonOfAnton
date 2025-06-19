// frontend/src/pages/Dashboard.js
import React from 'react';
import { Home, LogOut, User, Plus } from 'lucide-react';

const Dashboard = ({ user, onSelectFlow, onCreateNewFlow, onLogout, flows, loadingFlows, firebaseAuthUserId }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 font-inter flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <Home size={30} className="mr-3 text-blue-600" /> Your Flows
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-gray-700 font-medium flex items-center text-sm md:text-base">
            <User size={20} className="mr-2 text-purple-600" />
            <span className="break-all">{firebaseAuthUserId}</span>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all transform hover:scale-105 flex items-center"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Flow Card */}
          <button
            onClick={onCreateNewFlow}
            className="group relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-xl flex items-center justify-center border-4 border-dashed border-blue-300 hover:border-white transition-all duration-300 overflow-hidden transform hover:scale-[1.02]"
          >
            <Plus size={60} className="text-white opacity-70 group-hover:opacity-100 transition-opacity transform group-hover:rotate-90 duration-300" />
            <span className="absolute bottom-6 text-white text-lg font-bold opacity-90 group-hover:opacity-100 transition-opacity">
              Create New Flow
            </span>
            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></div>
          </button>

          {loadingFlows ? (
            <div className="col-span-full text-center p-8 text-gray-600 text-lg">
              Loading flows...
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : flows.length === 0 ? (
            <div className="col-span-full text-center p-8 text-gray-500 text-lg">
              No flows found. Create your first one!
            </div>
          ) : (
            flows.map((flow) => (
              <div
                key={flow.flowId} {/* Use flowId from MongoDB for key */}
                onClick={() => onSelectFlow(flow)}
                className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{flow.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{`Nodes: ${flow.nodes?.length || 0}, Edges: ${flow.edges?.length || 0}`}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    Last Updated: {new Date(flow.lastUpdated || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
