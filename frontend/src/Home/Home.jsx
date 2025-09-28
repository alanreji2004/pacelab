import styles from './Home.module.css';
import cyberImg from '../assets/cyberpunk.webp';
import pacelablogo from '../assets/logo.webp';

const Home = () => {
    return (
        <div className={styles.perspectiveContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navLogo}>
                    <img src={pacelablogo} alt="PaceLab Logo" />
                </div>
        
                <li><a href="#about">About</a></li>
                <li><a href="#leaderboard">Leaderboard</a></li>
        
                <button className={styles.registerButton}>Register</button>
            </nav>


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
            5</div>
    </div>
  );
};

export default Home;
