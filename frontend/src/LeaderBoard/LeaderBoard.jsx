import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import Navbar from "../Navbar/Navbar"
import styles from "./LeaderBoard.module.css"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import ToastContainer from "../Toast/ToastContainer"
import { motion, AnimatePresence } from "framer-motion"

export default function LeaderBoard() {
  const [users, setUsers] = useState([])
  const [animate, setAnimate] = useState(false)
  const adminEmails = ["admin@pacelabtest.com", "admin@pacelabctf.com"]

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), snap => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data = data.filter(u => !adminEmails.includes(u.email))
      data.sort((a, b) => {
        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0)
        return (a.lastSolvedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0) - (b.lastSolvedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0)
      })
      setUsers(data.map((u, i) => ({ ...u, rank: i + 1 })))
      setTimeout(() => setAnimate(true), 300)
    })
    return () => unsubUsers()
  }, [])

  return (
    <div className={styles.outer}>
      <Navbar />
      <div className={styles.container}>
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
                  {users.map(u => (
                    <motion.tr
                      key={u.id}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    >
                      <td>{u.rank}</td>
                      <td>{u.username || "Unnamed"}</td>
                      <td>{u.score || 0}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.graphBox}>
          <h2 className={styles.subtitle}>Score Comparison</h2>
          <div className={styles.graphScroll}>
            <div className={styles.graphInner} style={{ width: `${users.length * 120}px` }}>
              <BarChart width={users.length * 120} height={300} data={users}>
                <XAxis dataKey="username" stroke="#0ff" />
                <YAxis stroke="#0ff" />
                <Tooltip />
                <Bar dataKey="score" fill="#0ff" isAnimationActive={animate} animationDuration={1500} />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
