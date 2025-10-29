import { useState, useEffect, useMemo } from "react"
import { db, auth } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where, onSnapshot, doc, runTransaction, arrayUnion, increment, serverTimestamp } from "firebase/firestore"
import Navbar from "../Navbar/Navbar"
import styles from "./Challenges.module.css"
import { sha256 } from "js-sha256"
import { useNavigate } from "react-router-dom"
import ToastContainer from "../Toast/ToastContainer"
import { FaCheckCircle } from "react-icons/fa";

export default function Challenges() {
  const [user, loading] = useAuthState(auth)
  const [challenges, setChallenges] = useState([])
  const [userData, setUserData] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [flagInput, setFlagInput] = useState("")
  const [error, setError] = useState("")
  const [loadingAction, setLoadingAction] = useState(false)
  const navigate = useNavigate()

  const SECTION_ORDER = [
    "Miscellaneous",
    "Web",
    "Forensics",
  ]

  useEffect(() => { if (!loading && !user) navigate("/login") }, [user, loading, navigate])

  useEffect(() => {
    const q = query(collection(db, "challenges"), where("status", "==", "published"))
    const unsub = onSnapshot(q, snap => setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!user) return
    const unsubUser = onSnapshot(doc(db, "users", user.uid), d => { if (d.exists()) setUserData({ id: d.id, ...d.data() }) })
    return () => unsubUser()
  }, [user])

  const normalized = s => (s || "").toString().trim().toLowerCase()

  const sections = useMemo(() => {
    const sectionSet = new Set()
    challenges.forEach(c => { if (c.section) sectionSet.add(c.section.toString().trim()) })
    const allSections = Array.from(sectionSet)
    const lowerToOriginal = {}
    allSections.forEach(s => { lowerToOriginal[normalized(s)] = s })
    const ordered = []
    SECTION_ORDER.forEach(pref => { if (lowerToOriginal[normalized(pref)]) ordered.push(lowerToOriginal[normalized(pref)]) })
    const remaining = allSections.filter(s => !SECTION_ORDER.includes(normalized(s))).sort((a,b)=>a.localeCompare(b,undefined,{sensitivity:"base"}))
    return [...ordered, ...remaining]
  }, [challenges])

  const openModal = c => { setSelectedChallenge(c); setFlagInput(""); setError(""); setModalOpen(true) }
  const closeModal = () => setModalOpen(false)

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
        const userRef = doc(db, "users", user.uid)
        transaction.update(userRef, {
          score: increment(challengeData.score),
          solvedChallenges: arrayUnion(selectedChallenge.id),
          lastSolvedAt: serverTimestamp()
        })
        transaction.update(challengeRef, { solves: increment(1) })
        const toastRef = doc(collection(db, "toasts"))
        transaction.set(toastRef, {
          username: userData.username || userData.email,
          message: `+${challengeData.score}pts`,
          createdAt: serverTimestamp()
        })
      })
      setModalOpen(false)
    } catch (err) { setError(err.message) }
    setLoadingAction(false)
  }

  const hasSolved = c => userData?.solvedChallenges?.includes(c.id)
  const getDifficultyColor = difficulty => {
    const d = normalized(difficulty)
    if (d === "very easy") return "#7ddc5b"
    if (d === "easy") return "#36b37e"
    if (d === "medium") return "#f59e0b"
    if (d === "hard") return "#ef4444"
    return "#9ca3af"
  }

  if (loading) return null
  if (!user || !userData) return <Navbar />

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Challenges</h1>
        {sections.map(section => (
          <div key={section}>
            <h2 className={styles.sectionTitle}>{section}</h2>
            <div className={styles.grid}>
              {challenges.filter(c => (c.section || "").toString().trim() === section).map(c => (
                <div key={c.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{c.name}</div>
                    <div className={styles.cardMeta}>
                      <span style={{ color: getDifficultyColor(c.difficulty), fontWeight: "bold" }}>{c.difficulty}</span>
                      <span className={styles.cardScore}>{c.score}pts</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardSolves}>Solves: {c.solves || 0}</div>
                  </div>
                  <div className={styles.cardActions}>
                    {hasSolved(c) && <div className={styles.solvedBadgeCard}><div className={styles.solvedLabel}>Solved</div></div>}
                    <button className={styles.primaryButton} onClick={() => openModal(c)} disabled={loadingAction}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && selectedChallenge && (
        <div className={styles.modalWrap} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{selectedChallenge.name}</h3>
            <div className={styles.modalHeader}>
              <span style={{ color: getDifficultyColor(selectedChallenge.difficulty), fontWeight: "bold" }}>{selectedChallenge.difficulty}</span>
              <span className={styles.modalPoints}>{selectedChallenge.score} pts</span>
            </div>
            <div className={styles.modalContent}>
              <div dangerouslySetInnerHTML={{ __html: selectedChallenge.description }} />
              {selectedChallenge.imageFileName && selectedChallenge.imageFileName.toString().trim().toLowerCase().endsWith(".mp3") && (
                <div className={styles.audioWrap}>
                  <audio controls className={styles.audioPlayer}>
                    <source src={`/assets/${selectedChallenge.imageFileName}`} type="audio/mpeg" />
                  </audio>
                  <a className={styles.downloadButton} href={`/assets/${selectedChallenge.imageFileName}`} download>Download Audio</a>
                </div>
              )}
              {selectedChallenge.imageFileName && !selectedChallenge.imageFileName.toString().trim().toLowerCase().endsWith(".mp3") && (
                <div className={styles.modalImageWrap}>
                  <img className={styles.modalImage} src={`/assets/${selectedChallenge.imageFileName}`} alt={selectedChallenge.name} />
                </div>
              )}
              {selectedChallenge.link && (
                <a className={styles.modalLink} href={selectedChallenge.link} target="_blank" rel="noopener noreferrer">View Challenge</a>
              )}
              <div className={styles.flagSection}>
                {hasSolved(selectedChallenge) && (
                  <div className={styles.solvedTop}>
                    <div className={styles.solvedBox}>
                      <FaCheckCircle />
                    </div>
                    <div className={styles.solvedTextModal}>You have solved this challenge</div>
                  </div>
                )}
                <input className={styles.input} placeholder="blackout{your_flag}" value={flagInput} onChange={e => setFlagInput(e.target.value)} disabled={hasSolved(selectedChallenge) || loadingAction} />
                {error && <div className={styles.errorText}>{error}</div>}
                <div className={styles.modalRow}>
                  <button className={styles.primaryButton} onClick={handleSubmitFlag} disabled={hasSolved(selectedChallenge) || loadingAction}>{hasSolved(selectedChallenge) ? "Solved" : (loadingAction ? "Checking..." : "Submit Flag")}</button>
                  <button className={styles.secondaryButton} onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}
