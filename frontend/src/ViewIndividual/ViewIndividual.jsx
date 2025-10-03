import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"
import { Navigate } from "react-router-dom"
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore"
import AdminNavbar from "../AdminNavbar/AdminNavbar"
import styles from "./ViewIndividual.module.css"
import ToastContainer from "../Toast/ToastContainer"

const ADMIN_EMAILS = ["admin@pacelabctf.com", "admin@pacelabtest.com"]

export default function ViewIndividual() {
  const [user, loading] = useAuthState(auth)
  const [individuals, setIndividuals] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), async snap => {
      const data = []
      for (const d of snap.docs) {
        const u = { id: d.id, ...d.data() }
        if (ADMIN_EMAILS.includes(u.email)) continue
        let solved = []
        let totalScore = 0
        if (Array.isArray(u.solvedChallenges) && u.solvedChallenges.length > 0) {
          const challengesRef = collection(db, "challenges")
          const q = query(challengesRef, where("__name__", "in", u.solvedChallenges))
          const solvedSnap = await getDocs(q)
          solved = solvedSnap.docs.map(doc => {
            const c = doc.data()
            totalScore += c.score || 0
            return { id: doc.id, name: c.name || "Unnamed", score: c.score || 0 }
          })
        }
        data.push({ ...u, solved, totalScore })
      }
      data.sort((a, b) => b.totalScore - a.totalScore)
      setIndividuals(data.map((u, i) => ({ ...u, rank: i + 1 })))
    })
    return () => unsub()
  }, [])

  if (loading) return null
  if (!user || !ADMIN_EMAILS.includes(user.email)) return <Navigate to="/admin/login" replace />

  return (
    <div className={styles.page}>
      <AdminNavbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Individuals Overview</h1>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Challenge</th>
                <th>Score</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {individuals.map(u => (
                <>
                  <tr key={u.id + "-header"}>
                    <td rowSpan={u.solved.length || 1}>{u.rank}</td>
                    <td rowSpan={u.solved.length || 1}>{u.username || "Unnamed"}</td>
                    <td rowSpan={u.solved.length || 1}>{u.email}</td>
                    <td rowSpan={u.solved.length || 1}>{u.phone || "-"}</td>
                    {u.solved.length > 0 ? (
                      <>
                        <td>{u.solved[0].name}</td>
                        <td>{u.solved[0].score}</td>
                        <td rowSpan={u.solved.length || 1}>{u.totalScore}</td>
                      </>
                    ) : (
                      <>
                        <td>-</td>
                        <td>0</td>
                        <td>0</td>
                      </>
                    )}
                  </tr>
                  {u.solved.slice(1).map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.score}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
