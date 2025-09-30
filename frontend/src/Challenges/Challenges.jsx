import { useState, useEffect } from "react"
import { db, auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, onSnapshot, doc, runTransaction, updateDoc, arrayUnion, increment,addDoc } from "firebase/firestore"
import Navbar from "../Navbar/Navbar"
import styles from "./Challenges.module.css"
import { sha256 } from "js-sha256"
import { useNavigate,Link } from "react-router-dom"
import { serverTimestamp } from "firebase/firestore"
import ToastContainer from "../Toast/ToastContainer"


export default function Challenges() {
  const [user, loading] = useAuthState(auth)
  const [challenges, setChallenges] = useState([])
  const [team, setTeam] = useState(null)
  const [userData, setUserData] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [flagInput, setFlagInput] = useState("")
  const [error, setError] = useState("")
  const [loadingAction, setLoadingAction] = useState(false)
  const navigate = useNavigate() 

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login") 
    }
  }, [user, loading, navigate])

  useEffect(() => {
    const q = query(collection(db, "challenges"), where("status", "==", "published"))
    const unsub = onSnapshot(q, snap => {
      setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!user) return
    const unsubUser = onSnapshot(doc(db, "users", user.uid), d => {
      if (d.exists()) {
        setUserData({ id: d.id, ...d.data() })
        if (d.data().teamId) {
          const unsubTeam = onSnapshot(doc(db, "teams", d.data().teamId), td => {
            if (td.exists()) setTeam({ id: td.id, ...td.data() })
          })
          return () => unsubTeam()
        }
      }
    })
    return () => unsubUser()
  }, [user])

  if (loading) return null
  if (!user || !userData) return <Navbar />

  const openModal = c => {
    setSelectedChallenge(c)
    setFlagInput("")
    setError("")
    setModalOpen(true)
  }

  const handleSubmitFlag = async () => {
    if (!flagInput || !selectedChallenge) return
    setLoadingAction(true)
    setError("")
    const flagHash = sha256(flagInput.trim())
    try {
      await runTransaction(db, async transaction => {
        const challengeRef = doc(db, "challenges", selectedChallenge.id)
        const challengeDoc = await transaction.get(challengeRef)
        if (!challengeDoc.exists()) throw new Error("Challenge not found")
        const challengeData = challengeDoc.data()
        if (challengeData.flagHash !== flagHash) throw new Error("Incorrect flag")
        if (userData.solvedChallenges?.includes(selectedChallenge.id)) throw new Error("Already solved")
        if (team?.solvedChallenges?.includes(selectedChallenge.id)) throw new Error("Already solved by team")
        const userRef = doc(db, "users", user.uid)
        transaction.update(userRef, {
          score: increment(challengeData.score),
          solvedChallenges: arrayUnion(selectedChallenge.id),
          lastSolvedAt: serverTimestamp()
        })
        if (team) {
          const teamRef = doc(db, "teams", team.id)
          transaction.update(teamRef, {
            score: increment(challengeData.score),
            solvedChallenges: arrayUnion(selectedChallenge.id),
            lastSolvedAt: serverTimestamp()
          })
        }
        transaction.update(challengeRef, {
          solves: increment(1)
        })
      const toastRef = doc(collection(db, "toasts"))
      transaction.set(toastRef, {
        message: `${team ? team.name : userData.email} +${challengeData.score}pts`,
        createdAt: serverTimestamp()
      })
      })
      setModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
    setLoadingAction(false)
  }

  const hasSolved = c => {
    if (!userData) return false
    if (userData.solvedChallenges?.includes(c.id)) return true
    if (team?.solvedChallenges?.includes(c.id)) return true
    return false
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Challenges</h1>
        <div className={styles.grid}>
          {challenges.length === 0 && <div className={styles.empty}>No published challenges</div>}
          {challenges.map(c => (
            <div key={c.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <Link to={c.link}><div className={styles.cardTitle}>{c.name}</div></Link>
                <div className={styles.cardScore}>{c.score}</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardSolves}>Solves: {c.solves || 0}</div>
              </div>
              <div className={styles.cardActions}>
                  {c.link && (
                    <button 
                    className={styles.viewButton} 
                    onClick={() => window.open(c.link, "_blank")}
                    >
                    View Challenge
                    </button>
                )}

                {hasSolved(c) ? (
                  <div className={styles.solvedText}>Solved</div>
                ) : (
                  <button className={styles.primaryButton} onClick={() => openModal(c)} disabled={loadingAction}>Submit Flag</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {modalOpen && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Submit Flag</h3>
            <p className={styles.warningText}>Beware of people around you when typing the flag!</p>
            <input className={styles.input} placeholder="Enter flag" value={flagInput} onChange={e => setFlagInput(e.target.value)} />
            {error && <div className={styles.errorText}>{error}</div>}
            <div className={styles.modalRow}>
              <button className={styles.primaryButton} onClick={handleSubmitFlag} disabled={loadingAction}>{loadingAction ? "Checking..." : "Submit"}</button>
              <button className={styles.secondaryButton} onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}
