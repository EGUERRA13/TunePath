"use client"

import styles from "./page.module.css";
import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter } from "react-router-dom"
import Navbar from './navbar'
import Dagre from '@dagrejs/dagre';

import React from 'react';
import ReactFlow, { useNodesState, useEdgesState, useNodes, ReactFlowProvider, Controls, MarkerType, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import flstyles from './flow.module.css';

import { RunGemini } from "./geminiapi"

const initialNodes = [
];
const initialEdges = [
];

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction, nodesep:200, edgesep: 200, ranksep: 200 });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target, { label: edge.label }));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};


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
  const { fitView } = useReactFlow();
  const [request, setRequest] = useState("");
  const [responseData, setResponseData] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const CheckForNodes = useNodes();

  const onLayout = useCallback(
    (direction) => {
      console.log("RUNNING ON LAYOUT");
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );


  async function FlowChartConstructor(ArrOfNodes){
    let nodeArr = ArrOfNodes; //array containing all album node objects
    const nodeMap = new Map(); //map containing albums to check if specific album node already exists
    let idCount = 1;
    let source = "";
    let target = "";
    //loops through the array of album node objects to create corresponding ReactFlow nodes and edges
    for (let i = 1; i < nodeArr.length; i++){
      source = idCount.toString(); //source starts at the first node
       
      if ((nodeMap.has(nodeArr[i].albumName)) == false){
        //this code excecutes because we reached an album we havent created a node for yet
        const node = {id: idCount.toString(), position: { x: 100, y: nodeMap.size * 100 }, data: { label: nodeArr[i].albumName} }
        nodeMap.set(nodeArr[i].albumName, idCount); //add to map for future reference
        console.log("ADDING NODE " + nodeArr[i].albumName + " SINCE NODE DOESNT ALREADY EXIST");
        setNodes((nds) => nds.concat(node)); //adding album as a ReactFlow node
        idCount = idCount + 1;
        //now we loop through and deal with the edges of this node we found
        const edgeCount = nodeArr[i].edgeCount; //finds the edge count of the node we are on
        for (let j=1; j <= edgeCount;j++){
          let stringName = "edgeAlbum" + j;
          let edgeName = "edgeDesc" + j;
          const edgeDesc = nodeArr[i][edgeName] 
          const edgeNode = nodeArr[i][stringName];
          if (nodeMap.has(edgeNode) == false && edgeNode !='errornodetonowhere'){ //making sure the edge album is not an album already found
            target = idCount.toString(); 
            nodeMap.set(edgeNode, idCount); //adds the edge album to node map
            const newNode = {id: idCount.toString(), position: { x: j*100, y: nodeMap.size * 100}, data: { label: edgeNode} }
            console.log("ADDING NODE " + edgeNode + " AS AN EDGE NODE")
            setNodes((nds) => nds.concat(newNode)); //adds edge album as a ReactFlow node since not already created
            idCount = idCount + 1;
            const edgeId = 'e' + source + '-' + target; //creates id for current edge
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
            setEdges((eds) => eds.concat(edge)); //adds edge as a ReactFlow edge
          }else if (edgeNode !='errornodetonowhere'){ //code below excecutes when a node already created for an edge album is found
            target = nodeMap.get(edgeNode).toString(); //finds the node id of this album
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
            setEdges((eds) => eds.concat(edge)); //adds edge as a ReactFlow edge
          }
        }
      }else{//code excecutes when album is found that is already stored in the node map
        let sourceID = nodeMap.get(nodeArr[i].albumName); //gets already existing id of this album
        source = sourceID.toString();
        const edgeCount = nodeArr[i].edgeCount;
        for (let j=1; j <= edgeCount;j++){ //iterate the edges of this album
          let stringName = "edgeAlbum" + j;
          let edgeName = "edgeDesc" + j;
          const edgeDesc = nodeArr[i][edgeName] 
          const edgeNode = nodeArr[i][stringName];
          if (nodeMap.has(edgeNode) == false && edgeNode !='errornodetonowhere'){ //checks if edge album doesn't already exist in node map
            target = idCount.toString();
            nodeMap.set(edgeNode, idCount);
            const newNode = {id: idCount.toString(), position: { x: j*100, y: nodeMap.size * 100 }, data: { label: edgeNode} }
            console.log("ADDING NODE " + edgeNode + " AS AN EDGE NODE")
            setNodes((nds) => nds.concat(newNode)); //adds edge album as a ReactFlow node
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
            setEdges((eds) => eds.concat(edge)); //adds edge as ReactFlow edge
          }else if (edgeNode !='errornodetonowhere'){ //edge album node already exists so target will be found in the map
            target = nodeMap.get(edgeNode).toString(); //gets target id from node map
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
            setEdges((eds) => eds.concat(edge)); //adds edge as ReactFlow edge
          }
        }
      }
    }
  }


  const handleSubmit = (event) =>{
    event.preventDefault();
    (async () => {
      const flowChartArr = await RunGemini(request)
      console.log(flowChartArr.length + "LENGTH OF THE ARRAY CONTAINING NODE OBJECTS INSIDE THE FUNC");
      await FlowChartConstructor(flowChartArr);
    })()
    setRequest('')
  }

  useEffect(() => {
    setTimeout(() => {
      onLayout('TB');
       // Call onLayout after a short delay
    }, 15);
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        fitView();
      });
    }, 30);
  }, [CheckForNodes.length]);

  
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