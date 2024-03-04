'use client'
import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
    { 
        id: '1', 
        position: { x: 100, y: 100 }, 
        data: { label: 'Node 1' } 
    },
    { 
        id: '2', 
        position: { x: 100, y: 200 }, 
        data: { label: 'Node 2' } 
    },
  ];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function Flow() {
    return (
        <ReactFlow 
            nodes={initialNodes}
            edges={initialEdges}
        />
    )
}