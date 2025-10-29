import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import Navbar from "../Navbar/Navbar"
import styles from "./LeaderBoard.module.css"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"
import ToastContainer from "../Toast/ToastContainer"
import { motion, AnimatePresence } from "framer-motion"

export default function LeaderBoard() {
  const [users, setUsers] = useState([])
  const [chartData, setChartData] = useState([])
  const adminEmails = ["admin@pacelabtest.com", "admin@pacelabctf.com"]
  const colors = ["#a8f2a6", "#ff9f43", "#54a0ff", "#ff6b6b", "#48dbfb", "#feca57", "#1dd1a1", "#c56cf0", "#10ac84", "#ee5253"]

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), snap => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data = data.filter(u => !adminEmails.includes(u.email))
      data.sort((a, b) => (b.score || 0) - (a.score || 0))
      setUsers(data)

      const allTimesSet = new Set()

      data.forEach(u => {
        if (Array.isArray(u.scoreHistory) && u.scoreHistory.length) {
          u.scoreHistory.forEach(s => {
            const t = typeof s.time === "object" && s.time?.toMillis ? s.time.toMillis() : (typeof s.time === "number" ? s.time : null)
            if (t) allTimesSet.add(t)
          })
        } else {
          const t = u.lastSolvedAt?.toMillis?.() || u.createdAt?.toMillis?.() || Date.now()
          allTimesSet.add(t - 60000)
          allTimesSet.add(t)
        }
      })

      const times = Array.from(allTimesSet).sort((a, b) => a - b)
      const timeLabels = times.map(t => new Date(t).toISOString())

      const buildHistoryMap = user => {
        const entries = []
        if (Array.isArray(user.scoreHistory) && user.scoreHistory.length) {
          user.scoreHistory.forEach(s => {
            const t = typeof s.time === "object" && s.time?.toMillis ? s.time.toMillis() : (typeof s.time === "number" ? s.time : null)
            if (t) entries.push({ t, score: typeof s.score === "number" ? s.score : Number(s.score) || 0 })
          })
        } else {
          const t = user.lastSolvedAt?.toMillis?.() || user.createdAt?.toMillis?.() || Date.now()
          entries.push({ t: t - 60000, score: 0 })
          entries.push({ t, score: user.score || 0 })
        }
        entries.sort((a, b) => a.t - b.t)
        return entries
      }

      const userHistories = {}
      data.forEach(u => {
        userHistories[u.id] = buildHistoryMap(u)
      })

      const getScoreAt = (history, timeMs) => {
        if (!history || !history.length) return null
        let last = null
        let i = 0
        while (i < history.length && history[i].t <= timeMs) {
          last = history[i]
          i++
        }
        return last ? last.score : history[0] ? history[0].score : null
      }

      const points = timeLabels.map(label => {
        const tms = Date.parse(label)
        const obj = { time: label }
        data.forEach(u => {
          const score = getScoreAt(userHistories[u.id], tms)
          obj[u.id] = score !== null && score !== undefined ? score : null
        })
        return obj
      })

      setChartData(points)
    })
    return () => unsub()
  }, [])

  return (
    <div className={styles.outer}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.graphBox}>
          <h2 className={styles.subtitle}>Score Progresion</h2>
          <div className={styles.graphArea}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(168, 242, 166, 0.08)" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="rgb(168, 242, 166)" />
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(168,242,166,0.3)", color: "rgb(168,242,166)" }} labelFormatter={() => ""} />
                {users.map((u, i) => (
                  <Line
                    key={u.id}
                    dataKey={u.id}
                    name={u.username || `User ${i + 1}`}
                    type="monotone"
                    stroke={colors[i % colors.length]}
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                    isAnimationActive
                    animationDuration={800}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.tableBox}>
          <h1 className={styles.title}>Individual Rankings</h1>
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
                <AnimatePresence>
                  {users.map((u, idx) => (
                    <motion.tr key={u.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                      <td>{idx + 1}</td>
                      <td>{u.username || "Unnamed"}</td>
                      <td>{u.score || 0}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
