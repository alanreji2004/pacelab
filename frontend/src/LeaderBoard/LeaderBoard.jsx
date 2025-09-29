import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import Navbar from "../Navbar/Navbar"
import styles from "./LeaderBoard.module.css"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function LeaderBoard() {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const unsubTeams = onSnapshot(collection(db, "teams"), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => (b.score || 0) - (a.score || 0))
      setTeams(data.map((t, i) => ({ ...t, rank: i + 1 })))
      setTimeout(() => setAnimate(true), 300)
    })

    const unsubUsers = onSnapshot(collection(db, "users"), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const filtered = data.filter(u => (u.score || 0) > 0)
      filtered.sort((a, b) => (b.score || 0) - (a.score || 0))
      setUsers(filtered.map((u, i) => ({ ...u, rank: i + 1 })).slice(0, 5))
    })

    return () => {
      unsubTeams()
      unsubUsers()
    }
  }, [])

  return (
    <div className={styles.outer}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.tableSection}>
          <h1 className={styles.title}>Team Leaderboard</h1>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(t => (
                  <tr key={t.id}>
                    <td>{t.rank}</td>
                    <td>{t.name || "Unnamed"}</td>
                    <td>{t.score || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h1 className={styles.title}>Individual Leaderboard</h1>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.rank}</td>
                    <td>{u.username || "Unnamed"}</td>
                    <td>{u.score || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.graphSection}>
          <div className={styles.graphBox}>
            <h2 className={styles.subtitle}>Score Comparison</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teams}>
                <XAxis dataKey="name" stroke="#0ff" />
                <YAxis stroke="#0ff" />
                <Tooltip />
                <Bar dataKey="score" fill="#0ff" isAnimationActive={animate} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
