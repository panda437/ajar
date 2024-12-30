import RewardCard from '../components/RewardCard';
import RewardMemberModal from '../components/RewardMemberModal';
import AddMemberModal from '../components/AddMemberModal';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  useEffect(() => {
    getMembers();
  }, []);

  const getMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamMembers(Array.isArray(data) ? data : []);
      setFilteredMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setTeamMembers([]);
      setFilteredMembers([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter whenever searchTerm or teamMembers changes
  useEffect(() => {
    const results = (teamMembers || []).filter((member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(results);
  }, [searchTerm, teamMembers]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="bg-blue-800 text-white w-20 md:w-24 flex flex-col items-center py-6">
        {/* Logo / Brand */}
        <div className="mb-6 text-center font-bold text-lg">Ajar</div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-6">
          <a href="#" className="text-white hover:text-gray-300 text-sm">
            Team
          </a>
          <a href="#" className="text-white hover:text-gray-300 text-sm">
            Reward
          </a>
          <a href="#" className="text-white hover:text-gray-300 text-sm">
            Timeline
          </a>
          <a href="#" className="text-white hover:text-gray-300 text-sm">
            Analytics
          </a>
          <a href="#" className="text-white hover:text-gray-300 text-sm">
            Ranking
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {/* TOP BAR / HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Team Members</h2>
          <button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Add Member
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full max-w-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* TEAM TABLE */}
        {loading ? (
          <p>Loading team members...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded">
            <table className="min-w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Coins</th>
                  <th className="py-2 px-4">Diamonds</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {(filteredMembers || []).map((member) => (
                  <tr key={member._id} className="border-b">
                    <td className="py-2 px-4">{member.name || ''}</td>
                    <td className="py-2 px-4">{member.coins || 0}</td>
                    <td className="py-2 px-4">{member.diamonds || 0}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded"
                        onClick={() => {
                          // Store the entire member object so we can access their _id
                          setSelectedMember(member);
                          setIsRewardModalOpen(true);
                        }}
                      >
                        Reward
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Reward Modal */}
      {isRewardModalOpen && selectedMember && (
        <RewardMemberModal
          isOpen={isRewardModalOpen}
          onClose={() => setIsRewardModalOpen(false)}
          // Pass in the member's ID and name
          recipientId={selectedMember._id}
          memberName={selectedMember.name}
        />
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onMemberAdded={() => {
            // Refresh the members list after adding
            getMembers();
          }}
        />
      )}
    </div>
  );
}
