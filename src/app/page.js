"use client"

import styles from "./page.module.css";
import { useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import Navbar from './navbar'

import ReactFlow, { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { RunGemini } from "./geminiapi"



export default function Home() {
  
  
  
  return (    
    <BrowserRouter>
      <Navbar />

    <main className={styles.main}>
      <MyForm />
    </main>
    </BrowserRouter>
  );
}

function MyForm() {
  const [request, setRequest] = useState("");
  const [responseData, setResponseData] = useState("");

  const handleSubmit = (event) =>{
    event.preventDefault();
    (async () => {
      setResponseData(await RunGemini(request))
    })()
    
    console.log(responseData);
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