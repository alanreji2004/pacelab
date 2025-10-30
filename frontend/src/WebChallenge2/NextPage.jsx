import React from "react"
import { useParams } from "react-router-dom"

export default function NextPage() {
  const { id } = useParams()
  return (
    <div style={{
      all: "unset",
      backgroundColor: "white",
      color: "black",
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "monospace"
    }}>
      <h1 style={{color:'black'}}>Access Granted</h1>
      <p style={{color:'black'}}>Document: {id}</p>
      <pre style={{fontSize: "18px", color: "black"}}>blackout&#123;ACCESS_GRANTED_7A12B3C&#125;</pre>
    </div>
  )
}
