import Footer from "../Footer/Footer"
import styles from "./About.module.css"

const About = () => {
  return (
    <div className={styles.perspectiveContainer}>  
      <div className={styles.content}>
        <h1 className={styles.title}>WHAT IS BLACKOUT: CTF?</h1>
        <p>
          BLACKOUT isn’t your typical CTF — it’s a story-driven digital mystery where each level unravels a piece of a hidden narrative. Hosted by Pace Lab, this experience blends interactive puzzles, hidden codes, cryptic clues, and web-based challenges that test your curiosity and problem-solving skills.
        </p><br />
        <p>
          Every stage takes you deeper into the unknown — decoding transmissions, uncovering secrets, and piecing together the truth behind the blackout.
        </p>
        <p>
          This isn’t about speed — it’s about insight, persistence, and discovery. Welcome to BLACKOUT. The question is — how far can you go before the lights fade completely?
        </p>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>⚙ Real Challenges</h3>
            <p>Industry-grade problems crafted by cybersecurity experts.</p>
          </div>
          <div className={styles.card}>
            <h3>🕓 Online Format</h3>
            <p>Continuous online competition.</p>
          </div>
          <div className={styles.card}>
            <h3>🧍‍♂ Solo Competition</h3>
            <p>Individual participation — your skill decides your rank.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default About
