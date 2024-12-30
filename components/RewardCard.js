export default function RewardCard({ name, points, message }) {
    return (
      <div className="reward-card" style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', borderRadius: '5px' }}>
        <h3>{name}</h3>
        <p>{message}</p>
        <span>Points Earned: {points}</span>
      </div>
    );
  }