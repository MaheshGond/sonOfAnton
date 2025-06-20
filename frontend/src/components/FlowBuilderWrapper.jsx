import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import NodeConfigPanel from './NodeConfigPanel';

const FlowBuilderWrapper = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      // Correct position using project method
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}_${+new Date()}`,
        type: 'default',
        position,
        data: { label: `${type}`, type, config: {} },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: newData } : node
      )
    );
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4 shadow-lg overflow-y-auto h-screen">
          <Sidebar />
        </div>

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 relative bg-white">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onInit={setReactFlowInstance} // this gives us access to the project method
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Node Config Panel */}
        <div className="w-72 bg-white p-4 shadow-lg border-l overflow-y-auto h-screen">
          {selectedNode ? (
            <NodeConfigPanel selectedNode={selectedNode} updateNodeData={updateNodeData} />
          ) : (
            <div className="text-gray-500">Select a node to configure</div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowBuilderWrapper;
