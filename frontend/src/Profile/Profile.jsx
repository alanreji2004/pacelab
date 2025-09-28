import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProfileNavbar from "../ProfileNavbar/ProfileNavbar"
import styles from "./Profile.module.css"
import { auth, db } from "../firebase"
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDocs,
  writeBatch,
  query,
  where
} from "firebase/firestore"

export default function Profile() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserDoc, setCurrentUserDoc] = useState(null)
  const [currentTeam, setCurrentTeam] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [loadingTeam, setLoadingTeam] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showMemberRemoveModal, setShowMemberRemoveModal] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)
  const [newTeamName, setNewTeamName] = useState("")
  const [joinTeamId, setJoinTeamId] = useState("")
  const [previewTeam, setPreviewTeam] = useState(null)
  const [previewMembers, setPreviewMembers] = useState([])
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const flashError = (msg) => {
    setError(msg)
    setTimeout(() => setError(""), 2000)
  }
  const flashInfo = (msg) => {
    setInfo(msg)
    setTimeout(() => setInfo(""), 2000)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setCurrentUser(u))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!currentUser) {
      setCurrentUserDoc(null)
      setCurrentTeam(null)
      setTeamMembers([])
      return
    }
    const userRef = doc(db, "users", currentUser.uid)
    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        setCurrentUserDoc(snap.data())
      } else {
        setDoc(userRef, {
          username: currentUser.displayName || "",
          email: currentUser.email || "",
          teamId: null,
          score: 0,
          createdAt: serverTimestamp()
        })
      }
    })
    const unsubscribeUser = onSnapshot(userRef, (snap) => {
      setCurrentUserDoc(snap.exists() ? snap.data() : null)
    })
    return () => unsubscribeUser()
  }, [currentUser])

  useEffect(() => {
    if (!currentUserDoc || !currentUserDoc.teamId) {
      setCurrentTeam(null)
      setTeamMembers([])
      return
    }
    setLoadingTeam(true)
    const teamRef = doc(db, "teams", currentUserDoc.teamId)
    const unsubscribeTeam = onSnapshot(teamRef, async (snap) => {
      if (!snap.exists()) {
        setCurrentTeam(null)
        setTeamMembers([])
        setLoadingTeam(false)
        return
      }
      const teamData = { id: snap.id, ...snap.data() }
      setCurrentTeam(teamData)
      const memberIds = teamData.members || []
      if (!memberIds.length) {
        setTeamMembers([])
        setLoadingTeam(false)
        return
      }
      const usersRef = collection(db, "users")
      const chunks = []
      for (let i = 0; i < memberIds.length; i += 10) chunks.push(memberIds.slice(i, i + 10))
      const membersList = []
      for (const chunk of chunks) {
        const q2 = query(usersRef, where("__name__", "in", chunk))
        const r2 = await getDocs(q2)
        r2.forEach((d) => membersList.push({ id: d.id, ...d.data() }))
      }
      const orderedMembers = memberIds.map(
        (id) => membersList.find((u) => u.id === id) || { id, username: "Unknown", score: 0 }
      )
      setTeamMembers(orderedMembers)
      setLoadingTeam(false)
    })
    return () => unsubscribeTeam()
  }, [currentUserDoc])

  const openCreateModal = () => {
    setNewTeamName("")
    setError("")
    setInfo("")
    setShowCreateModal(true)
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName.trim()) {
      flashError("Enter team name")
      return
    }
    try {
      const teamRef = await addDoc(collection(db, "teams"), {
        name: newTeamName.trim(),
        createdBy: currentUser.uid,
        members: [currentUser.uid],
        createdAt: serverTimestamp(),
        score: 0
      })
      await updateDoc(doc(db, "users", currentUser.uid), { teamId: teamRef.id })
      flashInfo("Team created")
      setShowCreateModal(false)
    } catch {
      flashError("Could not create team")
    }
  }

  const openJoinModal = () => {
    setJoinTeamId("")
    setPreviewTeam(null)
    setPreviewMembers([])
    setError("")
    setInfo("")
    setShowJoinModal(true)
  }

  const handleFetchTeamForJoin = async (e) => {
    e.preventDefault()
    if (!joinTeamId.trim()) {
      flashError("Enter team id")
      return
    }
    try {
      const tRef = doc(db, "teams", joinTeamId.trim())
      const snap = await getDoc(tRef)
      if (!snap.exists()) {
        flashError("Team not found")
        return
      }
      const teamData = { id: snap.id, ...snap.data() }
      setPreviewTeam(teamData)
      const members = []
      for (const m of teamData.members || []) {
        const md = await getDoc(doc(db, "users", m))
        members.push({ id: m, ...(md.exists() ? md.data() : { username: "Unknown", score: 0 }) })
      }
      setPreviewMembers(members)
      flashInfo("Confirm to join this team")
    } catch {
      flashError("Failed to fetch team")
    }
  }

  const handleConfirmJoin = async () => {
    if (!previewTeam?.id) return
    if ((previewTeam.members || []).length >= 3) {
      flashError("Team full")
      return
    }
    try {
      await updateDoc(doc(db, "teams", previewTeam.id), { members: arrayUnion(currentUser.uid) })
      await updateDoc(doc(db, "users", currentUser.uid), { teamId: previewTeam.id })
      flashInfo("Joined team successfully")
      setPreviewTeam(null)
      setPreviewMembers([])
      setShowJoinModal(false)
    } catch {
      flashError("Failed to join")
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove) return
    try {
      await updateDoc(doc(db, "teams", currentTeam.id), { members: arrayRemove(memberToRemove.id) })
      await updateDoc(doc(db, "users", memberToRemove.id), { teamId: null })
      setShowMemberRemoveModal(false)
      setMemberToRemove(null)
      flashInfo("Member removed")
    } catch(error) {
        console.log(error)
      flashError("Failed to remove member")
    }
  }

  const handleLeaveTeam = async () => {
    if (!currentTeam) return
    if (currentTeam.createdBy === currentUser.uid) {
      flashError("Creator must delete team")
      return
    }
    try {
      await updateDoc(doc(db, "teams", currentTeam.id), { members: arrayRemove(currentUser.uid) })
      await updateDoc(doc(db, "users", currentUser.uid), { teamId: null })
      flashInfo("Left team")
    } catch {
      flashError("Failed to leave team")
    }
  }

  const openDeleteModal = () => {
    setShowDeleteModal(true)
    setError("")
    setInfo("")
  }

  const handleDeleteTeam = async (confirmText) => {
    if (confirmText !== "DELETE") {
      flashError("Type DELETE to confirm")
      return
    }
    try {
      const tRef = doc(db, "teams", currentTeam.id)
      const tSnap = await getDoc(tRef)
      if (!tSnap.exists()) {
        flashError("Team not found")
        return
      }
      const mems = tSnap.data().members || []
      const batch = writeBatch(db)
      mems.forEach((mId) => batch.update(doc(db, "users", mId), { teamId: null }))
      batch.delete(tRef)
      await batch.commit()
      setShowDeleteModal(false)
      flashInfo("Team deleted")
    } catch {
      flashError("Failed to delete team")
    }
  }

  return (
    <div className={styles.outer}>
      <ProfileNavbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Profile</h1>
        {!currentUser && (
          <div className={styles.centerBox}>
            <p className={styles.lead}>You must be logged in</p>
            <button className={styles.cta} onClick={() => navigate("/login")}>Go to Login</button>
          </div>
        )}
        {currentUser && currentUserDoc && !currentUserDoc.teamId && (
          <div className={styles.centerBox}>
            <p className={styles.lead}>{currentUserDoc.username || currentUser.email}</p>
            <p className={styles.subLead}>{currentUser.email}</p>
            <div className={styles.actions}>
              <button className={styles.cta} onClick={openCreateModal}>Create Team</button>
              <button className={styles.ghost} onClick={openJoinModal}>Join Team</button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {info && <p className={styles.info}>{info}</p>}
          </div>
        )}
        {currentUser && currentUserDoc && currentUserDoc.teamId && (
        <>
          <div className={styles.centerBox}>
            <p className={styles.lead}>{currentUserDoc.username || currentUser.email}</p>
            <p className={styles.subLead}>{currentUser.email}</p>
            </div>
          <div className={styles.teamBox}>
            <div className={styles.teamHeader}>
              <div>
                <h2 className={styles.teamName}>{currentTeam?.name || "Team"}</h2><br />
                <p className={styles.teamMeta}>
                  Team ID: <span className={styles.teamId}>{currentTeam?.id}</span>
                  <button
                    className={styles.copyBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(currentTeam?.id || "")
                      flashInfo("Team ID copied")
                    }}
                  >
                    Copy
                  </button>
                </p><br />
                <div className={styles.totalRow}>
                    <strong>Total Score:</strong>
                    <span>{currentTeam?.score || 0}</span>
                </div>
              </div>
              <div className={styles.teamControls}>
                {currentTeam?.createdBy === currentUser.uid ? (
                  <button className={styles.cta} onClick={openDeleteModal}>Delete Team</button>
                ) : (
                  <button className={styles.ghost} onClick={handleLeaveTeam}>Leave Team</button>
                )}
              </div>
            </div>
            <div className={styles.membersList}>
              <div className={styles.memberHeader}>
                <span>Member</span>
                <span>Points</span>
                {currentTeam?.createdBy === currentUser.uid && <span>Action</span>}
              </div>
              
              {loadingTeam && <p className={styles.lead}>Loading members...</p>}
              {!loadingTeam && !teamMembers.length && <p className={styles.lead}>No members</p>}
              {!loadingTeam && teamMembers.map((m) => (
                <div key={m.id} className={styles.memberRow}>
                  <div className={styles.memberName}>{m.username || m.email}  {m.id === currentTeam?.createdBy && (
                        <span className={styles.leaderTag}>[Leader]</span>
                        )}</div>
                  <div className={styles.memberScore}>{m.score || 0}</div>
                  {currentTeam?.createdBy === currentUser.uid && m.id !== currentUser.uid && (
                    <button className={styles.removeBtn} onClick={() => { setMemberToRemove(m); setShowMemberRemoveModal(true) }}>Remove</button>
                  )}
                </div>
              ))}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {info && <p className={styles.info}>{info}</p>}
          </div>
          </>
        )}
      </div>
      {showCreateModal && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Create Team</h3>
            <form onSubmit={handleCreateTeam} className={styles.modalForm}>
              <input className={styles.input} value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Team name" />
              <div className={styles.modalActions}>
                <button type="button" className={styles.ghost} onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className={styles.cta}>Create</button>
              </div>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            {info && <p className={styles.info}>{info}</p>}
          </div>
        </div>
      )}
      {showJoinModal && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Join Team</h3>
            <form onSubmit={handleFetchTeamForJoin} className={styles.modalForm}>
              <input className={styles.input} value={joinTeamId} onChange={(e) => setJoinTeamId(e.target.value)} placeholder="Team ID" />
              <div className={styles.modalActions}>
                <button type="button" className={styles.ghost} onClick={() => setShowJoinModal(false)}>Cancel</button>
                <button type="submit" className={styles.cta}>Fetch</button>
              </div>
            </form>
            {previewTeam && (
              <div className={styles.preview}>
                <p className={styles.previewTitle}>{previewTeam.name}</p>
                <div className={styles.previewMembers}>
                  {previewMembers.map((m) => (
                    <div key={m.id} className={styles.previewMember}>{m.username || m.email}</div>
                  ))}
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.ghost} onClick={() => { setPreviewTeam(null); setPreviewMembers([]) }}>Cancel</button>
                  <button className={styles.cta} onClick={handleConfirmJoin}>Confirm Join</button>
                </div>
              </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            {info && <p className={styles.info}>{info}</p>}
          </div>
        </div>
      )}
      {showMemberRemoveModal && memberToRemove && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Remove Member</h3>
            <p className={styles.lead}>Remove {memberToRemove.username || memberToRemove.email}?</p>
            <div className={styles.modalActions}>
              <button className={styles.ghost} onClick={() => { setShowMemberRemoveModal(false); setMemberToRemove(null) }}>Cancel</button>
              <button className={styles.cta} onClick={handleRemoveMember}>Remove</button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className={styles.modalWrap}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Delete Team</h3>
            <p className={styles.lead}>Type <strong>DELETE</strong> to confirm</p>
            <DeleteConfirm onConfirm={handleDeleteTeam} onCancel={() => setShowDeleteModal(false)} />
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function DeleteConfirm({ onConfirm, onCancel }) {
  const [confirmText, setConfirmText] = useState("")
  return (
    <>
      <input className={styles.input} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Type DELETE" />
      <div className={styles.modalActions}>
        <button className={styles.ghost} onClick={onCancel}>Cancel</button>
        <button className={styles.cta} onClick={() => onConfirm(confirmText)}>Delete</button>
      </div>
    </>
  )
}
