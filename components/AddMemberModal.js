import { useState } from 'react';

const AddMemberModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [coins, set
Coins] = useState('');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/add-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, role, coins: parseInt(coins, 10) }),
      });

      if (response.
ok) {
        console.log('Member added successfully');
        closeModal();
        // Optionally, refresh the team list
      } else {
        console.error('Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <div>
      <button onClick={openModal}>Add New Member</button>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Add New Member</h2>
            <form onSubmit={handleSubmit}>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Role:</label
>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>

              <label>Initial Coins:</label>
              <input
                type="number"
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                required
              />

              <button type="submit">Add Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMemberModal;
