import React, { useEffect, useState } from "react"
import styles from "./Loading.module.css"
import { useLocation, Outlet } from "react-router-dom"

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => setIsLoading(false), 1500)

    return () => {
      clearTimeout(timer)
    }
  }, [location.key])

  if (isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.text}>Initializing exploits... Stand by.</p>
      </div>
    )
  }

  return <Outlet />
}
