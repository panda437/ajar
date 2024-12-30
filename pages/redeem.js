// pages/redeem.js

import React from 'react';

export default function Redeem() {
  const userDetails = {
    coins: 110,
    diamonds: 20,
    name: 'Username Last Name',
    avatarUrl: '/some-avatar.jpg', // Change to your actual avatar path or keep a placeholder
  };

  const redeemableRewards = [
    {
      id: 1,
      name: 'A Day Off',
      cost: 5000,
      description: 'Redeem a day off using 5000 coins',
    },
    {
      id: 2,
      name: 'Amazon Coupon (₹1000)',
      cost: 10000,
      description: 'Get an amazon coupon worth ₹1000 using 10,000 coins',
    },
    {
      id: 3,
      name: 'Swiggy Super (3 months)',
      cost: 2000,
      description: 'Get a Swiggy Super subscription (3 months) using 2000 coins',
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-100 border-r flex flex-col items-center py-8">
        {/* Company Logo */}
        <div className="mb-6">
          <button className="border px-3 py-1 bg-white font-semibold">
            Company Logo
          </button>
        </div>

        {/* User Avatar */}
        <div className="mb-4">
          {/* Use a real <img> or <Image> if on Next.js. For now, a placeholder circle or real image */}
          <img
            src={userDetails.avatarUrl}
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>

        {/* Username */}
        <div className="text-center mb-8">
          <p className="font-semibold">{userDetails.name}</p>
          {/* Optional: camera icon / edit avatar button */}
        </div>

        {/* Nav Links */}
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
      <main className="flex-1 flex flex-col">
        {/* Banner */}
        <div className="bg-gray-300 h-48 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-700">Banner</h1>
        </div>

        {/* Coins + Diamonds row */}
        <div className="flex justify-end items-center bg-white py-4 px-6 border-b">
          <div className="mr-6 text-gray-700">
            Your coins 
            <span className="ml-1 text-yellow-500">🪙</span> 
            <span className="ml-1 font-semibold">{userDetails.coins}</span>
          </div>
          <div className="text-gray-700">
            Your Diamonds
            <span className="ml-1 text-gray-500">💎</span> 
            <span className="ml-1 font-semibold">{userDetails.diamonds}</span>
          </div>
        </div>

        {/* Redeemable Items */}
        <div className="flex-1 bg-gray-50 p-6">
          <h2 className="text-xl font-bold mb-4">Redeem Store</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {redeemableRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white p-4 rounded shadow flex flex-col items-center"
              >
                {/* Placeholder for item image */}
                <div className="bg-gray-300 w-full h-48 mb-4 flex items-center justify-center text-gray-500 text-lg">
                  Image
                </div>

                {/* Reward name + cost */}
                <h3 className="text-md font-semibold mb-2 text-center">
                  {reward.name}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-2">
                  {reward.description}
                </p>
                <p className="mb-4 text-gray-700 font-semibold">
                  {reward.cost} Coins
                </p>

                {/* Redeem Button */}
                <button className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded">
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
