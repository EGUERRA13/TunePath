"use client"

import styles from "./page.module.css";
import { useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import Navbar from './navbar'

import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import styless from './flow.module.css';

import { RunGemini } from "./geminiapi"

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



export default function Home() {
  
  return (    
    <BrowserRouter>
      <Navbar />

    <main className={styles.main}>
      <MyForm />
    </main>
    <div className={styless.flow}>
      <ReactFlow 
        nodes={initialNodes}
        edges={initialEdges}
        panOnDrag={false}
      />
    </div>
    
    </BrowserRouter>
  );
}

function MyForm() {
  const [request, setRequest] = useState("");
  const [responseData, setResponseData] = useState("");

  const handleSubmit = (event) =>{
    event.preventDefault();
    (async () => {
      const flowChartArr = await RunGemini(request)
      setResponseData(flowChartArr[1].albumName);
    })()
    
    //console.log(responseData);
    setRequest('')
  }
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
      <textarea readOnly rows={30} value={responseData}></textarea>
    </form>
  )
}