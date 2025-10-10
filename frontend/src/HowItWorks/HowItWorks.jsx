import React from "react"
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import styles from "./HowItWorks.module.css"

const HowItWorks = () => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>How It Works</h1>
        <h2 className={styles.subHeading}>Your Mission. Your Mind. Your Move.</h2>

        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Watch the Episodes</h3>
            <p className={styles.cardText}>
              Each one hides clues leading to deeper mysteries.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Solve the Challenges</h3>
            <p className={styles.cardText}>
              Use your logic, hacking, and problem-solving skills.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Earn Points & Rise</h3>
            <p className={styles.cardText}>
              Climb the leaderboard and unlock hidden content.
            </p>
          </div>
        </div>

        <p className={styles.quote}>
          “Every episode is a door. Every flag, a key.” 🗝
        </p>

        <section className={styles.rulesSection}>
          <h2 className={styles.rulesHeading}>📜 Read The Rules — Before You Play</h2>
          <ul className={styles.rulesList}>
            <li>This is a solo competition. Collaboration or flag sharing is not allowed.</li>
            <li>Multiple registrations or identity impersonation will lead to disqualification.</li>
            <li>Flag Format: <span className={styles.highlight}>BLACKOUT&#123;your_flag_here&#125;</span></li>
            <li>All challenges are ethical and simulated — do not attack real systems.</li>
            <li>Do not brute-force flag inputs or endpoints.</li>
            <li>Attacking the CTF platform will result in immediate ban.</li>
            <li>If you found any bugs in the CTF platform, please report them to the organizers immediately.</li>
            <li>Each challenge awards points based on difficulty.</li>
            <li>Hints may cost points or time penalties.</li>
            <li>Respect fair play. Violations lead to disqualification.</li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default HowItWorks
