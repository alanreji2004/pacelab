import styles from "./AdminNavbar.module.css"
import pacelablogo from "../assets/logo.webp"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

export default function AdminNavbar() {
  const navigate = useNavigate()
  const handleLogout = async () => {
    await signOut(auth)
    navigate("/admin/login")
  }
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLogo} onClick={() => navigate("/")}>
        <img src={pacelablogo} alt="Logo" />
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}
