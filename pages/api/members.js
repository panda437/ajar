import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri);
  const db = await client.db('ajar'); 

  cachedDb = db;
  return db;
}

export default function handler(req, res) {
  const uri = process.env.MONGODB_URI;

  connectToDatabase(uri)
    .then(db => {
      db.collection('members').find({}).toArray()
        .then(members => {
          res.status(200).json(members);
        })
        .catch(err => res.status(500).json({ error: 'Failed to fetch members' }));
    })
    .catch(err => res.status(500).json({ error: 'Failed to connect to database' }));
}