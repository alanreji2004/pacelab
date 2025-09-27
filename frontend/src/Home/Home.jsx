import styles from './Home.module.css';
import cyberImg from '../assets/cyberpunk.webp';

const Home = () => {
  return (
    <div className={styles.perspectiveContainer}>
      <div className={styles.gridPlane}>
        <div className={styles.scanLine}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white pt-20 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center mb-4 leading-snug">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            CYBERSPACE
          </span>
          <span className="text-cyan-500 text-3xl opacity-50 block mt-2">
            PROJECT ECHO
          </span>
        </h1>
        <p className="max-w-xl text-center text-gray-400 text-lg">
          The grid tiles have a transparent background and white thin borders, angled to achieve the 3D effect shown in the original image.
        </p>
      </div>
        <div className={styles.imageWrapper}>
          <img src={cyberImg} alt="Cyber Illustration" fill className={styles.heroImage} />
        </div>
    </div>
  );
};

export default Home;
