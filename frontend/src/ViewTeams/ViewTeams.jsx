import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"
import { Navigate } from "react-router-dom"
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import AdminNavbar from "../AdminNavbar/AdminNavbar"
import styles from "./ViewTeams.module.css"

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function ViewTeams() {
  const [user, loading] = useAuthState(auth)
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "teams"), async snap => {
      const teamData = []
      for (const d of snap.docs) {
        const t = { id: d.id, ...d.data() }
        const members = []
        if (Array.isArray(t.members)) {
          for (const uid of t.members) {
            const uref = doc(db, "users", uid)
            const udoc = await getDoc(uref)
            if (udoc.exists()) {
              const udata = udoc.data()
              members.push({
                id: udoc.id,
                username: udata.username || "Unnamed",
                score: udata.score || 0
              })
            }
          }
        }
        const totalScore = members.reduce((sum, m) => sum + (m.score || 0), 0)
        teamData.push({ ...t, members, totalScore })
      }
      teamData.sort((a, b) => b.totalScore - a.totalScore)
      setTeams(teamData.map((t, i) => ({ ...t, rank: i + 1 })))
    })
    return () => unsub()
  }, [])

  if (loading) return null
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />

  return (
    <div className={styles.page}>
      <AdminNavbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Teams Overview</h1>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Member</th>
                <th>Score</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(t => (
                <>
                  <tr key={t.id + "-header"}>
                    <td rowSpan={t.members.length || 1}>{t.rank}</td>
                    <td rowSpan={t.members.length || 1}>{t.name || "Unnamed"}</td>
                    {t.members.length > 0 ? (
                      <>
                        <td>{t.members[0].username}</td>
                        <td>{t.members[0].score}</td>
                        <td rowSpan={t.members.length || 1}>{t.totalScore}</td>
                      </>
                    ) : (
                      <>
                        <td>-</td>
                        <td>0</td>
                        <td>0</td>
                      </>
                    )}
                  </tr>
                  {t.members.slice(1).map(m => (
                    <tr key={m.id}>
                      <td>{m.username}</td>
                      <td>{m.score}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
