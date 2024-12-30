export default function RedeemOptions() {
    const rewards = [
      { item: 'A Day Off', cost: 5000 },
      { item: 'Amazon Coupon (₹1000)', cost: 10000 },
      { item: 'Swiggy Super (3 months)', cost: 2000 },
    ];
  
    return (
      <div>
        <h2>Redeem Rewards</h2>
        <ul>
          {rewards.map((reward, index) => (
            <li key={index}>
              {reward.item} - Cost: {reward.cost} Points
            </li>
          ))}
        </ul>
      </div>
    );
  }