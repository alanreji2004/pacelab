import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { Navigate, useNavigate } from "react-router-dom"
import AdminNavbar from "../AdminNavbar/AdminNavbar"
import styles from "./AdminDashboard.module.css"

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AdminDashboard() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  if (loading) return null
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />

  return (
    <div className={styles.dashboard}>
      <AdminNavbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Admin Dashboard</h1>
        <div className={styles.buttonRow}>
          <button className={styles.primaryButton} onClick={() => navigate("/admin/add-challenge")}>
            Add Challenges
          </button>
          <button className={styles.secondaryButton} onClick={() => navigate("/admin/view-teams")}>
            View Teams
          </button>
        </div>
      </div>
    </div>
  )
}
