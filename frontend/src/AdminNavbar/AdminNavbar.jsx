import React, { useState, useEffect, useRef } from "react"
import styles from "./AdminNavbar.module.css"
import pacelablogo from "../assets/logo.webp"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"

export default function AdminNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const hamburgerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [menuOpen])

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return
      const clickedInsideMenu = menuRef.current.contains(e.target)
      const clickedHamburger = hamburgerRef.current && hamburgerRef.current.contains(e.target)
      if (menuOpen && !clickedInsideMenu && !clickedHamburger) setMenuOpen(false)
    }
    const onKey = (e) => {
      if (menuOpen && e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const handleLogout = async () => {
    await signOut(auth)
    navigate("/admin/login")
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLogo} onClick={() => navigate("/")}>
        <img src={pacelablogo} alt="Logo" />
      </div>

      <ul className={styles.navLinks}>
        <li>
          <button className={styles.dashboardButton} onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </button>
        </li>
        <li>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>

      <button
        ref={hamburgerRef}
        className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
        onClick={() => setMenuOpen((s) => !s)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <span className={styles.hamburgerBox}>
          <span className={styles.hamburgerInner} />
        </span>
      </button>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
      >
        <ul>
          <li>
            <button
              className={styles.dashboardButton}
              onClick={() => {
                setMenuOpen(false)
                navigate("/admin/dashboard")
              }}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={styles.logoutButton}
              onClick={() => {
                setMenuOpen(false)
                handleLogout()
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
