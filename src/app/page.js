"use client"

import styles from "./page.module.css";
import { useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import Navbar from './navbar'


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

  const handleSubmit = (event) =>{
    event.preventDefault();
    alert(request)
    
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
    </form>
  )
}