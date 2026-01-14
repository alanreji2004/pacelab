import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import About from "../About/About";
import heroImage from "../assets/cyberpunk.webp";
import spaceship from "../assets/spaceship2.webp";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Home() {
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const message = "BLACKOUT CTF 2025";

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
      <div className={styles.perspectiveContainer}>
        <Navbar />
        <div className={styles.gridPlane}></div>
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
        <img src={spaceship} alt="spaceship" className={styles.spaceshipImage} />
        <About />
      </section>
    </div>
  );
}
