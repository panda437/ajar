import React from 'react';

export default function Redeem() {
    const userDetails = {
        coins: 110,
        diamonds: 20
    };

    const redeemableRewards = [
        {
            id: 1,
            name: "A Day Off",
            cost: "5000 Coins",
             description: "Redeem a day off using 5000 coins"
        },
        {
            id: 2,
            name: "Amazon Coupon (₹1000)",
            cost: "10,000 Coins",
            description: "Get an amazon coupon worth ₹1000 using 10,000 coins"
        },
        {
            id: 3,
            name: "Swiggy Super (3 months)",
            cost: "2000 Coins",
             description: "Get a swiggy super subscription for 3 months using 2000 coins"
        }
    ];


  return (
    <div>
      <h2>Redeem Store</h2>
        <div>
            <h3>User Details</h3>
            <p>Your coins: {userDetails.coins}, Your diamonds: {userDetails.diamonds}</p>
        </div>
        <div>
            <h3>Redeemable Rewards</h3>
            <ul>
                {redeemableRewards.map(reward => (
                    <li key={reward.id}>
                        <h4>{reward.name}</h4>
                         <p>{reward.description}</p>
                        <p>Cost: {reward.cost}</p>
                        <button>Redeem</button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}
