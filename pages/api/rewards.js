import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  await client.connect();
  const db = client.db('ajar');
  cachedDb = db;
  return db;
}


export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const db = await connectToDatabase();
        const rewards = await db.collection('rewards').find({}).toArray();
        res.status(200).json(rewards);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
