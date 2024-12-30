import React, { useEffect, useState } from 'react';

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col items-center py-8">
        <div className="mb-6">
          <button className="border px-3 py-1 bg-white font-semibold">
            Company Logo
          </button>
        </div>
        <div className="mb-4">
          <img
            src="/user-avatar.jpg"
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
        <div className="text-center mb-8">
          <p className="font-semibold">Username Last Name</p>
        </div>
        <nav className="flex flex-col space-y-2">
          <a href="#" className="text-blue-800 hover:text-blue-600">
            Team
          </a>
          <a href="#" className="text-blue-800 hover:text-blue-600">
            Reward
          </a>
          <a href="#" className="text-blue-800 hover:text-blue-600">
            Timeline
          </a>
          <a href="#" className="text-blue-800 hover:text-blue-600">
            Analytics
          </a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Analytics / Timeline</h2>

        {error && <p className="text-red-600">Error: {error}</p>}
        {!error && transactions.length === 0 && (
          <p>No transactions found.</p>
        )}

        {/* Transactions */}
        <div className="space-y-4">
          {transactions.map((tx) => {
            const {
              _id,
              recipientName,
              senderName,
              currencyType,
              amount,
              message,
              createdAt,
            } = tx;

            const displayRecipient = recipientName || 'Recipient';
            const displaySender = senderName || 'Sender';
            const formattedDateTime = formatDateTime(createdAt);

            const currencyIcon =
              currencyType === 'diamonds' ? '💎' : '🪙';

            return (
              <div
                key={_id}
                className="bg-white border rounded-lg shadow p-4 flex flex-col space-y-2"
              >
                {/* Header: Recipient + Sender */}
                <div className="flex items-center justify-between">
                  {/* Recipient */}
                  <div className="flex items-center space-x-2">
                    <img
                      src="/recipient-avatar.jpg"
                      alt={displayRecipient}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-semibold">{displayRecipient}</p>
                      <p className="text-sm text-gray-500">
                        {formattedDateTime}
                      </p>
                    </div>
                  </div>

                  {/* Sender */}
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-600 text-sm">was awarded by</p>
                    <div className="flex items-center space-x-2">
                      <img
                        src="/sender-avatar.jpg"
                        alt={displaySender}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <p className="font-semibold">{displaySender}</p>
                    </div>
                  </div>
                </div>

                {/* Reward */}
                <div className="flex items-center space-x-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 font-bold text-xl">+</span>
                    <span className="text-xl">{currencyIcon}</span>
                    <span className="text-xl font-bold">{amount}</span>
                  </div>
                  <p className="text-gray-600">{message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
