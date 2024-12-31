import { useState } from 'react';

export default function RewardMemberModal({ isOpen, onClose, recipientId, memberName, refreshMembers }) {
  const [currencyType, setCurrencyType] = useState('coins');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          currencyType,
          amount: parseInt(amount, 10),
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reward');
      }

      // Refresh the members list after successfully adding a reward
      refreshMembers();

      // Close the modal
      onClose();
    } catch (err) {
      console.error('Error adding reward:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reward {memberName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Currency</label>
            <select
              value={currencyType}
              onChange={(e) => setCurrencyType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="coins">Coins</option>
              <option value="diamonds">Diamonds</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Rewarding...' : 'Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}