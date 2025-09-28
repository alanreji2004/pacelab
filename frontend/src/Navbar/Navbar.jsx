import React, { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import pacelablogo from '../assets/logo.webp';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName || user.email.split('@')[0]);
      } else {
        setUsername(null);
      }
    });
    return () => unsubscribe();
  }, []);

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
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.navLogo}>
        <img src={pacelablogo} alt="PaceLab Logo" />
      </div>

      <ul className={styles.navLinks}>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/challenges">Challenges</Link></li>
        <li><Link to="/leaderboard">Leaderboard</Link></li>
      </ul>

      {username ? (
        <button className={styles.registerButton} onClick={() => navigate('/profile')}>{username}</button>
      ) : (
        <button className={styles.registerButton} onClick={() => navigate('/login')}>Register</button>
      )}

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

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        role="menu"
        aria-hidden={!menuOpen}
      >
        <ul>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/challenges" onClick={() => setMenuOpen(false)}>Challenges</Link></li>
          <li><Link to="/leaderboard" onClick={() => setMenuOpen(false)}>Leaderboard</Link></li>
          <li>
            {username ? (
              <button className={styles.registerButton} onClick={() => { setMenuOpen(false); navigate('/profile'); }}>{username}</button>
            ) : (
              <button className={styles.registerButton} onClick={() => { setMenuOpen(false); navigate('/login'); }}>Register</button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
