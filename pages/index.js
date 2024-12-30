import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header>
        <h1>Welcome to Ajar.io</h1>
        <Link href="/dashboard"><button className={styles.button}>Go to Dashboard</button></Link>
      </header>
    </div>
  );
}