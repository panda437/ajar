import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link href="/dashboard">Team</Link></li>
        <li><Link href="/reward">Reward</Link></li> 
        <li><Link href="/timeline">Timeline</Link></li> 
        <li><Link href="/analytics">Analytics</Link></li> 
        <li><Link href="/ranking">Ranking</Link></li> 
      </ul>
    </nav>
  );
}