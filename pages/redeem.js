import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Redeem() {
  const [userDetails, setUserDetails] = useState(null);
  const [redeemableRewards, setRedeemableRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { email } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
  
        // Fetch user details and shop data
        const [membersRes, shopRes] = await Promise.all([
          fetch(`/api/members?email=${email}`, { cache: 'no-store' }),
          fetch('/api/shop', { cache: 'no-store' }),
        ]);
  
        if (!membersRes.ok) {
          throw new Error(`Failed to fetch user details: ${membersRes.statusText}`);
        }
        if (!shopRes.ok) {
          throw new Error(`Failed to fetch shop data: ${shopRes.statusText}`);
        }
  
        const [memberData, shopData] = await Promise.all([
          membersRes.json(), // Single user object
          shopRes.json(), // Array of shop items
        ]);
  
        // Set state with the fetched data
        setUserDetails(memberData);
        setRedeemableRewards(shopData);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  
    if (email) {
      fetchData();
    }
  }, [email]);
  const handleRedeem = async (reward) => {
    if (!userDetails) return;

    if (confirm(`Are you sure you want to redeem "${reward.name}" for ${reward.price} coins?`)) {
      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipientId: userDetails._id,
            currencyType: 'coins',
            amount: reward.price,
            message: `Redeemed ${reward.name}`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        alert(`Successfully redeemed "${reward.name}"!`);
        const updatedUser = await response.json();
        setUserDetails(updatedUser);
      } catch (err) {
        console.error(err);
        alert(`Failed to redeem reward: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-100 border-r flex flex-col items-center py-8">
        <div className="mb-6">
          <button className="border px-3 py-1 bg-white font-semibold">Company Logo</button>
        </div>
        <div className="mb-4">
          <img
            src="/some-avatar.jpg" // Replace with user avatar if available
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
        <div className="text-center mb-8">
          <p className="font-semibold">{userDetails?.name || 'Guest User'}</p>
        </div>
        <nav className="flex flex-col space-y-2">
          <a href="#" className="text-blue-800 hover:text-blue-600">Team</a>
          <a href="#" className="text-blue-800 hover:text-blue-600">Reward</a>
          <a href="#" className="text-blue-800 hover:text-blue-600">Timeline</a>
          <a href="#" className="text-blue-800 hover:text-blue-600">Analytics</a>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        <div className="bg-gray-300 h-48 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-700">Redeem Store</h1>
        </div>
        <div className="flex justify-end items-center bg-white py-4 px-6 border-b">
          <div className="mr-6 text-gray-700">
            Your coins <span className="ml-1 text-yellow-500">🪙</span>
            <span className="ml-1 font-semibold">{userDetails?.points?.myCoins || 0}</span>
          </div>
          <div className="text-gray-700">
            Your Diamonds <span className="ml-1 text-gray-500">💎</span>
            <span className="ml-1 font-semibold">{userDetails?.points?.myDiamonds || 0}</span>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 p-6">
          <h2 className="text-xl font-bold mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {redeemableRewards.map((reward) => (
              <div
                key={reward._id}
                className="bg-white p-4 rounded shadow flex flex-col items-center"
              >
                <div className="bg-gray-300 w-full h-48 mb-4 flex items-center justify-center text-gray-500 text-lg">
                  Image
                </div>
                <h3 className="text-md font-semibold mb-2 text-center">{reward.name}</h3>
                <p className="text-sm text-gray-600 text-center mb-2">{reward.description}</p>
                <p className="mb-4 text-gray-700 font-semibold">{reward.price} Coins</p>
                <button
                  onClick={() => handleRedeem(reward)}
                  className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded"
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}