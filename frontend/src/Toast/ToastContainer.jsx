import { useState, useEffect } from "react"
import { db } from "../firebase"
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore"
import Toast from "./Toast"
import styles from "./Toast.module.css"

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const now = new Date()
    const q = query(
      collection(db, "toasts"),
      where("createdAt", ">", now),
      orderBy("createdAt", "asc")
    )
    const unsub = onSnapshot(q, snap => {
      snap.docChanges().forEach(change => {
        if (change.type === "added") {
          const newToast = { id: change.doc.id, ...change.doc.data() }
          setToasts(prev => [...prev, newToast])
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== newToast.id))
          }, 3000)
        }
      })
    })
    return () => unsub()
  }, [])

  return (
    <div className={styles.toastWrapper}>
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={`${t.username} ${t.message}`}
          onClose={() =>
            setToasts(prev => prev.filter(toast => toast.id !== t.id))
          }
        />
      ))}
    </div>
  )
}
