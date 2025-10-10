import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"
import styles from "./Challenge.module.css"
import handout from "../assets/logo.webp"

export default function Challenge1() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [user, loading, navigate])

  if (loading) return null

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.title}>BLACKOUT: CyberQuest</div>
        <button className={styles.homeButton} onClick={() => navigate("/challenges")}>
          Go Back
        </button>
      </div>

      <div className={styles.container}>
        <h2 className={styles.challengeTitle}>Coordinates of Silence</h2>
        <div className={styles.tags}>
          <span className={styles.tag}>300 Points</span>
          <span className={styles.tag}>Medium</span>
          <span className={styles.tag}>OSINT / Miscellaneous</span>
          <span className={styles.tag}>Submit Order Bonus</span>
        </div>

        <div className={styles.description}>
          <p>
            A strange transmission was intercepted from a laptop in the latest episode of <span className={styles.highlight}>BLACKOUT</span>.
            The numbers flashing on the screen seem oddly familiar — perhaps they mark a place where it all began.
          </p>
          <p>
            The deeper you look, the more you'll find. But remember — the truth is hidden in plain sight.
          </p>
        </div>

        <div className={styles.hintBox}>
          <p className={styles.hintLabel}>Hint</p>
          <p className={styles.hintText}>
            “The signal originates from a place where ideas spark and stories are born.”
          </p>
        </div>

        <div className={styles.challengeHandout}>
          <p className={styles.handoutTitle}>Challenge Handout</p>
          <img src={handout} alt="Coordinates Hint" className={styles.handoutImage} />
          <p className={styles.handoutCaption}>
            Analyze the image carefully — what do these numbers point to?
          </p>
        </div>

        <div className={styles.flagSection}>
          <p className={styles.flagFormat}>
            Flag Format: <span>blackout&#123;Enter_Your_Flag&#125;</span>
          </p>
          <p className={styles.infoText}>
            Go back to the challenges page to submit the flag.
          </p>
        </div>
      </div>
    </div>
  )
}
