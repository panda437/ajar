import React, { useState, useEffect } from 'react';

export default function Timeline() {
    const [rewardEvents, setRewardEvents] = useState([]);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const response = await fetch('/api/rewards');
                if (response.ok) {
                    const data = await response.json();
                     setRewardEvents(data.map(event => ({
                        ...event,
                        timestamp: new Date(event.timestamp).toLocaleString()
                    })));
                } else {
                    console.error('Failed to fetch rewards');
                }
            } catch (error) {
                console.error('Error fetching rewards:', error);
            }
        };
        fetchRewards();
    }, []);


  return (
    <div>
      <h2>Timeline</h2>
        <ul>
            {rewardEvents.map(event => (
                <li key={event._id}>
                    <p><strong>{event.name}</strong> - {event.message}</p>
                    <small>{event.timestamp}</small>
                </li>
            ))}
        </ul>
    </div>
  );
}
