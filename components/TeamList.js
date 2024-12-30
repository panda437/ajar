import { useState, useEffect } from 'react';

export default function TeamList() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch('/api/members');
      const data = await response.json();
      setMembers(data);
    };

    fetchMembers();
  }, []);

  return (
    <div>
      <h2>Team Members</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Coins</th>
            <th>Diamonds</th>
            <th>Reward</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.coins}</td>
              <td>{member.diamonds}</td>
              <td><button onClick={() => console.log('Reward button clicked')}>Reward</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}