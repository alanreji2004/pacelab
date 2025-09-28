import { useState } from "react"
import { auth, db } from "../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore"
import { Link } from "react-router-dom"
import styles from "./Signup.module.css"
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();


  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      await updateProfile(user, { displayName: username })
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        teamId: null,
        score: 0,
        solvedChallenges: [],
        createdAt: new Date()
      })
      navigate("/");
    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            setError("Email is already in use");
        } else {
            setError(err.message);
    }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.homeButton}>Home</Link>
      <form onSubmit={handleSignup} className={styles.form}>
        <h2 className={styles.title}>Sign Up</h2>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />
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
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className={styles.switchText}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Go to Login</Link>
        </p>
      </form>
    </div>
  )
}
