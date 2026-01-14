import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import heroImage from "../assets/cyberpunk.webp";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Home() {
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const message = "BLACKOUT CTF 2026";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(message.substring(0, index));
      index++;
      if (index > message.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  const handleMainButton = () => {
    navigate(user ? "/profile" : "/login");
  };

  const handleRules = () => {
    navigate("/howitworks");
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.gridPlane}></div>
      <div className={styles.perspectiveContainer}>
        <Navbar />
        <div className={styles.content}>
          <h1 className={styles.heading} data-text="BLACKOUT CTF 2026">
            <span className={styles.titleMain}>{text}</span>
          </h1>
          <div className={styles.buttons}>
            <button onClick={handleMainButton} className={`${styles.btn} ${styles.btn1}`}>
              <svg>
                <rect x="0" y="0" fill="none" width="100%" height="100%"></rect>
              </svg>
              Start
            </button>
            <button onClick={handleRules} className={`${styles.btn} ${styles.btn1}`}>
              <svg>
                <rect x="0" y="0" fill="none" width="100%" height="100%"></rect>
              </svg>
              View Rules
            </button>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src={heroImage} alt="hero" className={styles.heroImage} />
        </div>
      </div>
      <section id="about" className={styles.aboutSection}>

        <div className={styles.aboutContainer}>
          <div className={styles.aboutHeader}>
            <h2 className={styles.aboutTitle}>WHAT IS BLACKOUT: <span className={styles.highlight}>CTF?</span></h2>
            <div className={styles.separator}></div>
          </div>

          <div className={styles.aboutBody}>
            <p className={styles.aboutText}>
              BLACKOUT isn’t your typical CTF — it’s a <span className={styles.textHighlight}>story-driven digital mystery</span> where each level unravels a piece of a hidden narrative. Hosted by Pace Lab, this experience blends interactive puzzles, hidden codes, and web-based challenges.
            </p>
            <p className={styles.aboutText}>
              Every stage takes you deeper into the unknown — decoding transmissions, uncovering secrets, and piecing together the truth behind the blackout. This isn’t about speed — it’s about <span className={styles.textHighlight}>insight, persistence, and discovery</span>.
            </p>
          </div>

          <div className={styles.cardGrid}>
            <div className={styles.featureCard}>
              <div className={styles.cardIcon}>⚙</div>
              <h3>Real Challenges</h3>
              <p>Industry-grade problems crafted by cybersecurity experts.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.cardIcon}>🕓</div>
              <h3>Online Format</h3>
              <p>Continuous online competition accessible from anywhere.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.cardIcon}>🧍‍♂</div>
              <h3>Solo Competition</h3>
              <p>Individual participation — your skill decides your rank.</p>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}
