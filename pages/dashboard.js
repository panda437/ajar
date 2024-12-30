import RewardCard from '../components/RewardCard';
import RewardMemberModal from '../components/RewardMemberModal';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);

  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const getMembers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/members');
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeamMembers(data || []);
        setFilteredMembers(data || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    getMembers();
  }, []);

  useEffect(() => {
    const results = (teamMembers || []).filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(results);
  }, [searchTerm, teamMembers]);

  return (
    <div>
      {loading ? (
        <p>Loading team members...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <h2>Team Members</h2>

          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Coins</th>
            <th>Diamonds</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(filteredMembers || []).map((member) => (
            <tr key={member._id}>
              <td>{member.name || ''}</td>
              <td>{member.coins || 0}</td>
              <td>{member.diamonds || 0}</td>
              <td>
                <button onClick={() => {
                  setSelectedMember(member.name);
                  setIsRewardModalOpen(true);
                }}>Reward</button>
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        </>
      )}

      {/* Reward Member Modal */}
      {isRewardModalOpen && (
        <RewardMemberModal isOpen={isRewardModalOpen} onClose={() => setIsRewardModalOpen(false)} memberName={selectedMember} />
      )}
    </div>
  );
}