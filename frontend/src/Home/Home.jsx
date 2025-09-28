import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import cyberImg from '../assets/cyberpunk.webp';
import pacelablogo from '../assets/logo.webp';

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuOpen]);

    useEffect(() => {
        const onDocClick = (e) => {
            if (!menuRef.current) return;
            const clickedInsideMenu = menuRef.current.contains(e.target);
            const clickedHamburger = hamburgerRef.current && hamburgerRef.current.contains(e.target);
            if (menuOpen && !clickedInsideMenu && !clickedHamburger) setMenuOpen(false);
        };
        const onKey = (e) => {
            if (menuOpen && e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);

return (
    <div className={styles.perspectiveContainer}>
        <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
            <div className={styles.navLogo}>
                <img src={pacelablogo} alt="PaceLab Logo" />
            </div>

            <ul className={styles.navLinks}>
                <li><a href="#about">About</a></li>
                <li><a href="#challenges">Challenges</a></li>
                <li><a href="#leaderboard">Leaderboard</a></li>
            </ul>

            <button className={styles.registerButton}>Register</button>

            <button
                ref={hamburgerRef}
                className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
                onClick={() => setMenuOpen((s) => !s)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
            >
                <span className={styles.hamburgerBox}>
                    <span className={styles.hamburgerInner} />
                </span>
            </button>
        </nav>

        <div
            id="mobile-menu"
            ref={menuRef}
            className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
            role="menu"
            aria-hidden={!menuOpen}
        >
            <ul>
                <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
                <li><a href="#challenges" onClick={() => setMenuOpen(false)}>Challenges</a></li>
                <li><a href="#leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</a></li>
                <li><button className={styles.registerButton} onClick={() => setMenuOpen(false)}>Register</button></li>
            </ul>
        </div>

        <div className={styles.gridPlane}></div>

        <div className={styles.content}>
            <h1 className={styles.heading} data-text="CAPTURE THE FLAG">
                <span className={styles.titleMain}>CAPTURE</span>
                <span className={styles.titleMain}>THE FLAG</span>
            </h1>
            <div className={styles.buttons}>
                <a href="#join" className={`${styles.btn} ${styles.btn1}`}>
                    <svg>
                        <rect x="2" y="2" fill="none" width="100%" height="100%" />
                    </svg>
                    JOIN
                </a>

                <a href="#how-it-works" className={`${styles.btn} ${styles.btn1}`}>
                    <svg>
                        <rect x="2" y="2" fill="none" width="100%" height="100%" />
                    </svg>
                    HOW IT WORKS
                </a>
            </div>
        </div>

        <div className={styles.imageWrapper}>
            <img src={cyberImg} alt="Cyber Illustration" className={styles.heroImage} />
        </div>
    </div>
  );
};

export default Home;
