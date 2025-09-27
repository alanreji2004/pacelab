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
        <h1 className={styles.heading}>
          <span className={styles.titleMain}>CAPTURE</span>
          <span className={styles.titleMain}>THE FLAG</span>
        </h1>
        <div className={styles.buttons}>
          <button className={styles.ctaButton}>JOIN</button>
          <button className={styles.ctaButton}>HOW IT WORKS</button>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        <img src={cyberImg} alt="Cyber Illustration" className={styles.heroImage} />
      </div>
    </div>
  );
};

export default Home;
