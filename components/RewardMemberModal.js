
import React, { useState } from 'react';

export default function RewardMemberModal({
  isOpen,
  onClose,
  recipientId,   // ID of the user receiving the reward
  memberName,    // Display name of the user receiving the reward
}) {
  const [currencyType, setCurrencyType] = useState('coins');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // We omit senderId for now (or set a default in the backend).
          // We do include the required recipientId, currencyType, amount, and message.
          recipientId,
          currencyType,
          amount: parseInt(amount, 10),
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reward');
      }

      console.log('Reward added successfully!');
      onClose(); // Closes the modal on success
    } catch (err) {
      console.error('Error adding reward:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Reward {memberName || 'Member'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Currency Selection */}
          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <select
              value={currencyType}
              onChange={(e) => setCurrencyType(e.target.value)}
              className="border w-full p-2 rounded"
            >
              <option value="coins">Coins</option>
              <option value="diamonds">Diamonds</option>
              {/* Add more currency types if needed */}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border w-full p-2 rounded"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border w-full p-2 rounded"
              rows="3"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Reward
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
