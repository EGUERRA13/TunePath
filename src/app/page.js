"use client"

import styles from "./page.module.css";
import { useState } from 'react'


export default function Home() {
  return (
    <main className={styles.main}>
      
      <MyForm />
    </main>
  );
}

function MyForm() {
  const [request, setRequest] = useState("");

  const handleSubmit = (event) =>{
    event.preventDefault();

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