import React, { useEffect } from "react"
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import styles from "./HowItWorks.module.css"

const HowItWorks = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              Each one hides clues leading to deeper mysteries. Pay close attention to every detail.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Solve the Challenges</h3>
            <p className={styles.cardText}>
              Use your logic, hacking, and problem-solving skills to crack the sophisticated codes.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Earn Points & Rise</h3>
            <p className={styles.cardText}>
              Climb the global leaderboard and unlock exclusive hidden content and rewards.
            </p>
          </div>
        </div>

        <div className={styles.quote}>
          Every episode is a door. Every flag, a key.
        </div>

        <section className={styles.rulesSection}>
          <h2 className={styles.rulesHeading}><span>//</span> Read The Rules: Protocol 0</h2>
          <ul className={styles.rulesList}>
            <li>This is a solo competition. Collaboration or flag sharing is strictly prohibited.</li>
            <li>Multiple registrations or identity impersonation will lead to immediate disqualification.</li>
            <li>Flag Format: <span className={styles.highlight}>BLACKOUT&#123;your_flag_here&#125;</span></li>
            <li>All challenges are ethical and simulated — do not attack real-world infrastructure.</li>
            <li>Do not brute-force flag inputs or endpoints. Use your intellect, not scripts.</li>
            <li>Attacking the CTF platform itself will result in an immediate permanent ban.</li>
            <li>If you discover any bugs in the platform, report them to the organizers responsibly.</li>
            <li>Each challenge awards points based on difficulty tier.</li>
            <li>Hints are available but may incur point or time penalties.</li>
            <li>Respect the code of fair play. Violations lead to immediate disqualification.</li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default HowItWorks
