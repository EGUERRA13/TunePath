"use client"

import styles from "./page.module.css";
import { useState, useEffect } from 'react'
import { BrowserRouter } from "react-router-dom"
import Navbar from './navbar'

import React from 'react';
import ReactFlow, { useNodesState, useEdgesState, useNodes, ReactFlowProvider, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import flstyles from './flow.module.css';

import { RunGemini } from "./geminiapi"

const initialNodes = [
];
const initialEdges = [
];


export default function Home() {

  
  return (    
    <BrowserRouter>
      <Navbar />

    <ReactFlowProvider>
    <main className={styles.main}>
      <MyForm />
    </main>
    </ReactFlowProvider>
    
    </BrowserRouter>
  );
}


function MyForm() {
  const [request, setRequest] = useState("");
  const [responseData, setResponseData] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const CheckForNodes = useNodes();


  function FlowChartConstructor(ArrOfNodes){
    let nodeArr = ArrOfNodes;
    const nodeMap = new Map();
    let idCount = 1;
    let source = "";
    let target = "";
  
    for (let i = 1; i < nodeArr.length; i++){
      source = idCount.toString();
       
      if ((nodeMap.has(nodeArr[i].albumName)) == false){
        
        const node = {id: idCount.toString(), position: { x: 100, y: nodeMap.size * 100 }, data: { label: nodeArr[i].albumName} }
        nodeMap.set(nodeArr[i].albumName, idCount);
        console.log("ADDING NODE " + nodeArr[i].albumName + " SINCE NODE DOESNT ALREADY EXIST");
        setNodes((nds) => nds.concat(node));
        idCount = idCount + 1;

        const edgeCount = nodeArr[i].edgeCount;
        for (let j=1; j <= edgeCount;j++){
          let stringName = "edgeAlbum" + j;
          let edgeName = "edgeDesc" + j;
          const edgeDesc = nodeArr[i][edgeName] 
          const edgeNode = nodeArr[i][stringName];
          if (nodeMap.has(edgeNode) == false){
            target = idCount.toString();
            nodeMap.set(edgeNode, idCount);
            const newNode = {id: idCount.toString(), position: { x: j*100, y: nodeMap.size * 100}, data: { label: edgeNode} }
            console.log("ADDING NODE " + edgeNode + " AS AN EDGE NODE")
            setNodes((nds) => nds.concat(newNode));
            idCount = idCount + 1;
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target, markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#FF0072',
            }, label:edgeDesc.toString() , style: {
              strokeWidth: 2,
              stroke: '#FF0072',
            }, }
            console.log("ADDING EDGE FROM " + source + " TO " + target + " SINCE NEW NODE")
            setEdges((eds) => eds.concat(edge));
          }else{
            target = nodeMap.get(edgeNode).toString();
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target, markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#FF0072',
            }, label:edgeDesc.toString() , style: {
              strokeWidth: 2,
              stroke: '#FF0072',
            },  }
            console.log("ADDING EDGE FROM " + source + " TO " + target + " SINCE ALREADY EXISTING NODE")
            setEdges((eds) => eds.concat(edge));
          }
        }
      }else{
        let sourceID = nodeMap.get(nodeArr[i].albumName);
        source = sourceID.toString();
        const edgeCount = nodeArr[i].edgeCount;
        for (let j=1; j <= edgeCount;j++){
          let stringName = "edgeAlbum" + j;
          let edgeName = "edgeDesc" + j;
          const edgeDesc = nodeArr[i][edgeName] 
          const edgeNode = nodeArr[i][stringName];
          if (nodeMap.has(edgeNode) == false){
            target = idCount.toString();
            nodeMap.set(edgeNode, idCount);
            const newNode = {id: idCount.toString(), position: { x: j*100, y: nodeMap.size * 100 }, data: { label: edgeNode} }
            console.log("ADDING NODE " + edgeNode + " AS AN EDGE NODE")
            setNodes((nds) => nds.concat(newNode));
            idCount = idCount + 1;
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target, markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#FF0072',
            }, label:edgeDesc.toString() , style: {
              strokeWidth: 2,
              stroke: '#FF0072',
            },  }
            console.log("ADDING EDGE FROM " + source + " TO " + target + " SINCE NEW NODE")
            setEdges((eds) => eds.concat(edge));
          }else{
            target = nodeMap.get(edgeNode).toString();
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target, markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#FF0072',
            }, label:edgeDesc.toString() , style: {
              strokeWidth: 2,
              stroke: '#FF0072',
            },  }
            console.log("ADDING EDGE FROM " + source + " TO " + target + " SINCE ALREADY EXISTING NODE")
            setEdges((eds) => eds.concat(edge));
          }
        }
      }
    }
  }


  const handleSubmit = (event) =>{
    event.preventDefault();
    (async () => {
      const flowChartArr = await RunGemini(request)
      setResponseData(flowChartArr[1].albumName);
      console.log(flowChartArr.length + "LENGTH OF THE ARRAY CONTAINING NODE OBJECTS INSIDE THE FUNC");
      FlowChartConstructor(flowChartArr);
    })()
    setRequest('')
  }

  
  return (
  
    <div>
      <label>Enter the name of an artist:
        <input
          type="text" 
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}>
        Generate Flowchart
      </button>
      <textarea readOnly rows={30} value={CheckForNodes.length + " NODES CURRENTLY:" + CheckForNodes + " AND ALSO CURRENTLY " + edges.length + " EDGES"}></textarea>
        <div className={flstyles.flow}>
          <ReactFlow 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            
          >
            <Controls />
          </ReactFlow >
      </div>
    </div>

  )
}