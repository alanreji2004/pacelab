import { useState, useEffect } from "react"
import { auth, db } from "../firebase"
import { Navigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import AdminNavbar from "../AdminNavbar/AdminNavbar"
import styles from "./AdminDashboard.module.css"
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore"
import { sha256 } from "js-sha256"

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

export default function AdminDashboard() {
  const [user, loading] = useAuthState(auth)
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [confirmBulkError, setConfirmBulkError] = useState("")
  const [name, setName] = useState("")
  const [link, setLink] = useState("")
  const [score, setScore] = useState("")
  const [flag, setFlag] = useState("")
  const [added, setAdded] = useState([])
  const [published, setPublished] = useState([])
  const [editModal, setEditModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState("")
  const [editLink, setEditLink] = useState("")
  const [editScore, setEditScore] = useState("")
  const [editFlag, setEditFlag] = useState("")
  const [loadingAction, setLoadingAction] = useState(false)
  const [bulkText, setBulkText] = useState("")
  const [confirmUnpublishAllOpen, setConfirmUnpublishAllOpen] = useState(false)

  useEffect(() => {
    const addedQ = query(collection(db, "challenges"), where("status", "==", "added"))
    const pubQ = query(collection(db, "challenges"), where("status", "==", "published"))
    const unsubA = onSnapshot(addedQ, (snap) => {
      setAdded(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubP = onSnapshot(pubQ, (snap) => {
      setPublished(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => { unsubA(); unsubP(); }
  }, [])

  if (loading) return null
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/admin/login" replace />

  const resetForm = () => {
    setName(""); setLink(""); setScore(""); setFlag("")
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name || !score || !flag) return
    setLoadingAction(true)
    const flagHash = sha256(flag.trim())
    await addDoc(collection(db, "challenges"), {
      name: name.trim(),
      link: link.trim() || "",
      score: Number(score),
      flagHash,
      status: "added",
      solves: 0,
      createdAt: Date.now()
    })
    resetForm()
    setLoadingAction(false)
  }

  const openEdit = (c) => {
    setEditingId(c.id)
    setEditName(c.name)
    setEditLink(c.link || "")
    setEditScore(String(c.score || ""))
    setEditFlag("")
    setEditModal(true)
  }

  const handleEditSave = async () => {
    if (!editName || !editScore) return
    setLoadingAction(true)
    const docRef = doc(db, "challenges", editingId)
    const payload = { name: editName.trim(), link: editLink.trim() || "", score: Number(editScore) }
    if (editFlag) payload.flagHash = sha256(editFlag.trim())
    await updateDoc(docRef, payload)
    setEditModal(false)
    setEditingId(null)
    setLoadingAction(false)
  }

  const handleDelete = async (id) => {
    setLoadingAction(true)
    await deleteDoc(doc(db, "challenges", id))
    setLoadingAction(false)
  }

  const handlePublish = async (id) => {
    setLoadingAction(true)
    await updateDoc(doc(db, "challenges", id), { status: "published" })
    setLoadingAction(false)
  }

  const handleUnpublish = async (id) => {
    setLoadingAction(true)
    await updateDoc(doc(db, "challenges", id), { status: "added" })
    setLoadingAction(false)
  }

  const handleBulkAdd = async () => {
    setConfirmBulkError("")
    let parsed
    try {
      parsed = JSON.parse(bulkText)
      if (!Array.isArray(parsed)) throw new Error("not array")
    } catch (err) {
      setConfirmBulkError("Invalid JSON array. Expected [{name,link,score,flag}, ...]")
      return
    }
    setLoadingAction(true)
    for (const item of parsed) {
      if (!item.name || !item.score || !item.flag) continue
      await addDoc(collection(db, "challenges"), {
        name: String(item.name).trim(),
        link: String(item.link || "").trim(),
        score: Number(item.score),
        flagHash: sha256(String(item.flag).trim()),
        status: "added",
        solves: 0,
        createdAt: Date.now()
      })
    }
    setBulkText("")
    setBulkModalOpen(false)
    setLoadingAction(false)
  }

  const handlePublishAllAdded = async () => {
    setLoadingAction(true)
    for (const c of added) {
      await updateDoc(doc(db, "challenges", c.id), { status: "published" })
    }
    setLoadingAction(false)
  }

  const handleUnpublishAllPublished = async () => {
    setLoadingAction(true)
    for (const c of published) {
      await updateDoc(doc(db, "challenges", c.id), { status: "added" })
    }
    setConfirmUnpublishAllOpen(false)
    setLoadingAction(false)
  }

  return (
    <div className={styles.dashboard}>
      <AdminNavbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Admin Dashboard</h1>
        <div className={styles.panel}>
          <div className={styles.addSection}>
            <h2 className={styles.sectionTitle}>Add Challenge</h2>
            <form className={styles.form} onSubmit={handleAdd}>
              <input className={styles.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input className={styles.input} placeholder="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
              <input className={styles.input} placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} required />
              <input className={styles.input} placeholder="Flag (will be hashed)" value={flag} onChange={(e) => setFlag(e.target.value)} required />
              <div className={styles.row}>
                <button className={styles.primaryButton} type="submit" disabled={loadingAction}>{loadingAction ? "Adding..." : "Add"}</button>
                <button className={styles.secondaryButton} type="button" onClick={() => setBulkModalOpen(true)}>Bulk Add</button>
              </div>
            </form>
          </div>
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>Added Challenges</h2>
            <div className={styles.controlsRow}>
              <button className={styles.secondaryButton} onClick={handlePublishAllAdded} disabled={loadingAction}>Publish All</button>
            </div>
            <div className={styles.grid}>
              {added.length === 0 && <div className={styles.empty}>No added challenges</div>}
              {added.map(c => (
                <div key={c.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{c.name}</div>
                    <div className={styles.cardScore}>{c.score}</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardLink}>{c.link || "-"}</div>
                    <div className={styles.cardSolves}>Solves: {c.solves || 0}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.ghostButton} onClick={() => handlePublish(c.id)} disabled={loadingAction}>Publish</button>
                    <button className={styles.ghostButton} onClick={() => openEdit(c)} disabled={loadingAction}>Edit</button>
                    <button className={styles.dangerButton} onClick={() => handleDelete(c.id)} disabled={loadingAction}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.panel}>
          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>Published Challenges</h2>
            <div className={styles.controlsRow}>
              <button className={styles.secondaryButton} onClick={() => setConfirmUnpublishAllOpen(true)} disabled={loadingAction}>Unpublish All</button>
            </div>
            <div className={styles.grid}>
              {published.length === 0 && <div className={styles.empty}>No published challenges</div>}
              {published.map(c => (
                <div key={c.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{c.name}</div>
                    <div className={styles.cardScore}>{c.score}</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardLink}>{c.link || "-"}</div>
                    <div className={styles.cardSolves}>Solves: {c.solves || 0}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.ghostButton} onClick={() => handleUnpublish(c.id)} disabled={loadingAction}>Unpublish</button>
                    <button className={styles.ghostButton} onClick={() => openEdit(c)} disabled={loadingAction}>Edit</button>
                    <button className={styles.dangerButton} onClick={() => handleDelete(c.id)} disabled={loadingAction}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {bulkModalOpen && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Bulk Add Challenges JSON</h3>
            <textarea className={styles.textarea} placeholder='[{"name":"x","link":"...","score":100,"flag":"CTF{...}"}, ...]' value={bulkText} onChange={(e) => setBulkText(e.target.value)} />
            {confirmBulkError && <div className={styles.formError}>{confirmBulkError}</div>}
            <div className={styles.modalRow}>
              <button className={styles.primaryButton} onClick={handleBulkAdd} disabled={loadingAction}>{loadingAction ? "Adding..." : "Add All"}</button>
              <button className={styles.secondaryButton} onClick={() => { setBulkModalOpen(false); setBulkText(""); setConfirmBulkError("") }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Edit Challenge</h3>
            <input className={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} />
            <input className={styles.input} value={editLink} onChange={(e) => setEditLink(e.target.value)} />
            <input className={styles.input} value={editScore} onChange={(e) => setEditScore(e.target.value)} />
            <input className={styles.input} placeholder="New Flag (leave empty to keep)" value={editFlag} onChange={(e) => setEditFlag(e.target.value)} />
            <div className={styles.modalRow}>
              <button className={styles.primaryButton} onClick={handleEditSave} disabled={loadingAction}>{loadingAction ? "Saving..." : "Save"}</button>
              <button className={styles.secondaryButton} onClick={() => setEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmUnpublishAllOpen && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirm Unpublish All</h3>
            <div className={styles.confirmText}>This will move all published challenges back to added.</div>
            <div className={styles.modalRow}>
              <button className={styles.dangerButton} onClick={handleUnpublishAllPublished} disabled={loadingAction}>{loadingAction ? "Unpublishing..." : "Unpublish All"}</button>
              <button className={styles.secondaryButton} onClick={() => setConfirmUnpublishAllOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
