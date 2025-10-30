import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function DocPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [audio] = useState(new Audio("/assets/commence.mp3"))
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qActive = params.get("active")
    const raw = location.search.replace("?", "")
    const isActive = qActive === "false" || raw === "false"
    setActive(isActive)
  }, [location.search])

  useEffect(() => {
    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    audio.addEventListener("timeupdate", updateProgress)
    return () => audio.removeEventListener("timeupdate", updateProgress)
  }, [audio])

  const onClick = () => {
    if (active) {
      navigate(`/doc/${id}/next`)
    } else {
      audio.currentTime = 0
      audio.play()
    }
  }

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
      alignItems: "center"
    }}>
      <button
        onClick={onClick}
        style={{
          padding: "12px 40px",
          fontSize: "20px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          cursor:"pointer",
          fontFamily: "monospace"
        }}
      >
        Listen
      </button>
      {!active && (
        <div style={{
          marginTop: "20px",
          width: "300px",
          height: "6px",
          backgroundColor: "#ddd",
          borderRadius: "3px"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "6px",
            backgroundColor: "black",
            borderRadius: "3px"
          }}></div>
        </div>
      )}
    </div>
  )
}
