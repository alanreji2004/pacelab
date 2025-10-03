import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProfileNavbar from "../ProfileNavbar/ProfileNavbar"
import styles from "./Profile.module.css"
import { auth, db } from "../firebase"
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore"
import ToastContainer from "../Toast/ToastContainer"

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [solvedList, setSolvedList] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [infoMsg, setInfoMsg] = useState("")

  const flashError = msg => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(""), 2000)
  }
  const flashInfo = msg => {
    setInfoMsg(msg)
    setTimeout(() => setInfoMsg(""), 2000)
  }

  useEffect(() => {
    if (user?.email && ADMIN_EMAIL && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      navigate("/admin/dashboard")
    }
  }, [user, navigate])

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u))
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!user) {
      setUserData(null)
      setSolvedList([])
      return
    }
    const userRef = doc(db, "users", user.uid)
    const unsubUser = onSnapshot(userRef, snap => {
      if (snap.exists()) setUserData({ id: snap.id, ...snap.data() })
    })
    return () => unsubUser()
  }, [user])

  useEffect(() => {
    const fetchSolved = async () => {
      if (!user) return
      try {
        if (!userData?.solvedChallenges || userData.solvedChallenges.length === 0) {
          setSolvedList([])
          return
        }
        const challengesRef = collection(db, "challenges")
        const q = query(challengesRef, where("__name__", "in", userData.solvedChallenges))
        const snap = await getDocs(q)
        const solved = snap.docs.map(d => ({
          id: d.id,
          name: d.data().name || "Unnamed",
          score: d.data().score || 0
        }))
        setSolvedList(solved)
      } catch {
        flashError("Failed to load challenges")
      }
    }
    fetchSolved()
  }, [user, userData])

  return (
    <div className={styles.outer}>
      <ProfileNavbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Profile</h1>
        {!user && (
          <div className={styles.centerBox}>
            <p className={styles.lead}>You must be logged in</p>
            <button className={styles.cta} onClick={() => navigate("/login")}>
              Go to Login
            </button>
          </div>
        )}
        {user && userData && (
          <div className={styles.centerBox}>
            <p className={styles.lead}>{userData.username || user.email}</p>
            <p className={styles.subLead}>{user.email}</p>
            {user.email === ADMIN_EMAIL ? (
              <div className={styles.actions}>
                <button className={styles.cta} onClick={() => navigate("/admin/dashboard")}>
                  View Dashboard
                </button>
              </div>
            ) : (
              <div className={styles.teamBox}>
                <div className={styles.teamHeader}>
                  <h2 className={styles.teamName}>Score: {userData.score || 0}</h2>
                </div>
                <div className={styles.membersList}>
                  <div className={styles.memberHeader}>
                    <span>Challenge</span>
                    <span>Points</span>
                  </div>
                  {solvedList.length === 0 && <p className={styles.lead}>No challenges solved yet</p>}
                  {solvedList.map(c => (
                    <div key={c.id} className={styles.memberRow}>
                      <div className={styles.memberName}>{c.name}</div>
                      <div className={styles.memberScore}>{c.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errorMsg && <p className={styles.error}>{errorMsg}</p>}
            {infoMsg && <p className={styles.info}>{infoMsg}</p>}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

    