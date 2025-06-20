import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

const FlowBuilder = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodeSelect,
  reactFlowInstance,
  setReactFlowInstance,
  reactFlowWrapper // ⭐️ Important: Receive wrapper
}) => {

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => nds.map((node) => {
      const change = changes.find(c => c.id === node.id);
      return change ? { ...node, ...change } : node;
    })),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => eds.map((edge) => {
      const change = changes.find(c => c.id === edge.id);
      return change ? { ...edge, ...change } : edge;
    })),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${+new Date()}`,
        type,
        position,
        data: { label: `${type} Node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, reactFlowWrapper, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={(_, node) => onNodeSelect(node)}
        onInit={setReactFlowInstance}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowBuilder;
