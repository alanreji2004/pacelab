import React from "react";
import styles from "./Footer.module.css";
import { FaInstagram, FaLinkedinIn, FaGlobe, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import pacelabLogo from '../assets/logo.webp';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <img src={pacelabLogo} alt="Pacelab Logo" className={styles.logo} />
        </div>

        <div className={styles.centerSection}>
          <h2 className={styles.eventTitle}>BLACKOUT CTF</h2>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/pacelab.in/" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://www.linkedin.com/company/pacelabtech/" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            <a href="https://www.pacelab.in/" target="_blank" rel="noreferrer"><FaGlobe /></a>
          </div>
        </div>

        <div className={styles.rightSection}>
          <h3 className={styles.contactTitle}>Contact</h3>
          <p className={styles.contactText}>Panampilly, Ernakulam, Kerala</p>
          <p className={styles.contactText}><FaEnvelope className={styles.icon} /> info@pacelab.in</p>
          <p className={styles.contactText}><FaPhoneAlt className={styles.icon} /> +91 8075090098</p>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>© {new Date().getFullYear()} Pacelab | Blackout CTF 2025</p>
      </div>
    </footer>
  );
}
