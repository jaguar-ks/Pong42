
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>PingPong Pro</div>
        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Experience the Thrill of Ping Pong</h1>
          <p>Join the ultimate online ping pong community and challenge players worldwide!</p>
          <div className={styles.ctas}>
            <a href="#" className={styles.primary}>Play Now</a>
            <a href="#" className={styles.secondary}>Learn More</a>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <h2>Game Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>{/* Add icon later */}</div>
              <h3>Real-time Multiplayer</h3>
              <p>Challenge players from around the world in exciting real-time matches.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>{/* Add icon later */}</div>
              <h3>Customizable Paddles</h3>
              <p>Personalize your gameplay with a wide range of paddle designs and colors.</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>{/* Add icon later */}</div>
              <h3>Global Leaderboards</h3>
              <p>Compete for the top spot and track your progress on our global leaderboards.</p>
            </div>
          </div>
        </section>

        <section id="about" className={styles.about}>
          <div className={styles.aboutContent}>
            <h2>About PingPong Pro</h2>
            <p>PingPong Pro is the ultimate online destination for ping pong enthusiasts. Our cutting-edge platform brings the excitement of table tennis to your screen, allowing you to compete with players worldwide, improve your skills, and climb the ranks.</p>
          </div>
          <div className={styles.aboutImage}>
            {/* Add image later */}
            <div className={styles.imagePlaceholder}>Ping Pong Image</div>
          </div>
        </section>

        <section id="contact" className={styles.contact}>
          <h2>Ready to Join?</h2>
          <p>Sign up now and get ready for the ping pong experience of a lifetime!</p>
          <a href="#" className={styles.primary}>Sign Up</a>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </div>
        <div className={styles.copyright}>© 2023 PingPong Pro. All rights reserved.</div>
      </footer>
    </div>
  );
}

