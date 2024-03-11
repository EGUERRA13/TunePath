"use client"

import styles from "./page.module.css";
import { useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import Navbar from './navbar'

import React from 'react';
import ReactFlow, { useNodesState, useEdgesState, useNodes, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import flstyles from './flow.module.css';

import { RunGemini } from "./geminiapi"

const initialNodes = [
  /*
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
  */
];
const initialEdges = [
  /*{ id: 'e1-2', source: '1', target: '2' }
*/];



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

  function FlowChartConstructor(ArrOfNodes){
    let nodeArr = ArrOfNodes;
    const nodeMap = new Map();
    let idCount = 1;
    let source = "";
    let target = "";
  
    for (let i = 1; i < nodeArr.length; i++){
      source = idCount;
       
      if ((nodeMap.has(nodeArr[i].albumName)) == false){
        const node = {id: idCount, position: { x: 100, y: (i*100) }, data: { label: nodeArr[i].albumName} }
        nodeMap.set(nodeArr[i].albumName, idCount);
        console.log("ADDING NODE " + nodeArr[i].albumName + " SINCE NODE DOESNT ALREADY EXIST");
        setNodes((nds) => nds.concat(node));
        idCount = idCount + 1;

        const edgeCount = nodeArr[i].edgeCount;
        for (let j=1; j <= edgeCount;j++){
          let stringName = "edgeAlbum" + j;
          const edgeNode = nodeArr[i][stringName];
          if (nodeMap.has(edgeNode) == false){
            target = idCount;
            nodeMap.set(edgeNode, idCount);
            const newNode = {id: idCount, position: { x: 100, y: ((i+j)*100) }, data: { label: edgeNode} }
            console.log("ADDING NODE " + edgeNode + " AS AN EDGE NODE")
            setNodes((nds) => nds.concat(newNode));
            idCount = idCount + 1;
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target }
            console.log("ADDING EDGE FROM " + source + " TO " + target + " SINCE NEW NODE")
            setEdges((eds) => eds.concat(edge));
          }else{
            target = nodeMap.get(edgeNode);
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target }
            console.log("ADDING EDGE FROM " + source + " TO " + target + " SINCE ALREADY EXISTING NODE")
            setEdges((eds) => eds.concat(edge));
          }
        }
      }else{
        source = nodeMap.get(nodeArr[i].albumName);
        const edgeCount = nodeArr[i].edgeCount;
        for (let j=1; j <= edgeCount;j++){
          let stringName = "edgeAlbum" + j;
          const edgeNode = nodeArr[i][stringName];
          if (nodeMap.has(edgeNode) == false){
            target = idCount;
            nodeMap.set(edgeNode, idCount);
            const newNode = {id: idCount, position: { x: 100, y: ((i+j)*100) }, data: { label: edgeNode} }
            console.log("ADDING NODE " + edgeNode + " AS AN EDGE NODE")
            setNodes((nds) => nds.concat(newNode));
            idCount = idCount + 1;
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target }
            console.log("ADDING EDGE FROM " + source + " TO " + target + " SINCE NEW NODE")
            setEdges((eds) => eds.concat(edge));
          }else{
            target = nodeMap.get(edgeNode);
            const edgeId = 'e' + source + '-' + target;
            const edge = {id: edgeId, source: source, target: target }
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

  const CheckForNodes = useNodes();
  console.log(CheckForNodes.length + 'before');
  
  
  return (
  
    <form onSubmit={handleSubmit}>
      <label>Enter the name of an artist:
        <input
          type="text" 
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
      </label>
      <input type="submit" />
      <textarea readOnly rows={30} value={CheckForNodes.length + "after"}></textarea>
        <div className={flstyles.flow}>
          <ReactFlow 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            panOnDrag={false}
          />
      </div>
    </form>

  )
}