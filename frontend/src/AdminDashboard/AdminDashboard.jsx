import { auth } from "../firebase"
import { Navigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import AdminNavbar from "../AdminNavbar/AdminNavbar"
import styles from "./AdminDashboard.module.css"

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AdminDashboard() {
  const [user, loading] = useAuthState(auth)
  if (loading) return null
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />
  return (
    <div className={styles.dashboard}>
      <AdminNavbar />
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <div className={styles.content}>
        <p>Welcome, Admin. Manage challenges here.</p>
      </div>
    </div>
  )
}
