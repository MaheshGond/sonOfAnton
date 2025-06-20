import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div>
      <h2 className="font-bold mb-4">Node Palette</h2>

      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
        onDragStart={(event) => onDragStart(event, 'Input Node')}
        draggable
      >
        Input Node
      </div>

      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
        onDragStart={(event) => onDragStart(event, 'Process Node')}
        draggable
      >
        Process Node
      </div>

      <div
        className="p-2 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
        onDragStart={(event) => onDragStart(event, 'Output Node')}
        draggable
      >
        Output Node
      </div>
    </div>
  );
};

export default Sidebar;
