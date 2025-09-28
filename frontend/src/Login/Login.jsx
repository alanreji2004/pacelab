import { useState } from "react"
import { auth } from "../firebase"
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import styles from "./Login.module.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSuccess("Login successful!")
      setTimeout(() => navigate("/"), 1500)
    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email to reset password")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess("Password reset email sent")
    } catch {
      setError("Failed to send reset email")
    }
  }

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.homeButton}>Home</Link>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.title}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="button"
            className={styles.showButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className={styles.switchText}>
          Don’t have an account? <Link to="/signup" className={styles.switchLink}>Sign Up</Link>
        </p>
        <p className={styles.forgotText} onClick={handleForgotPassword}>
          Forgot Password?
        </p>
      </form>
    </div>
  )
}
