import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

// Create a global variable to store the cached database connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('ajar'); // Replace 'ajar' with your database name

  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {      
      const db = await connectToDatabase();
      const rewardsCollection = db.collection('rewards');

      const { memberId, coins, diamonds, message } = req.body; // Assuming memberId is sent

      const rewardData = {
        memberId,
        coins,
        diamonds,
        message,
        timestamp: new Date(),
      };

      await rewardsCollection.insertOne(rewardData);
      res.status(200).json({ message: `Reward successfully added for member ${memberId}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to add reward' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}