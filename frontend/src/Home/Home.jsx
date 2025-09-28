import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';
import cyberImg from '../assets/cyberpunk.webp';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
    
return (
    <div className={styles.perspectiveContainer}>
        <Navbar />
        <div className={styles.gridPlane}></div>

        <div className={styles.content}>
            <h1 className={styles.heading} data-text="CAPTURE THE FLAG">
                <span className={styles.titleMain}>CAPTURE</span>
                <span className={styles.titleMain}>THE FLAG</span>
            </h1>
            <div className={styles.buttons}>
                <Link to="/profile" className={`${styles.btn} ${styles.btn1}`}>
                    <svg>
                        <rect x="2" y="2" fill="none" width="100%" height="100%" />
                    </svg>
                    JOIN
                </Link>

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
