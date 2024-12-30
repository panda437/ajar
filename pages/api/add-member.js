import { MongoClient } from 'mongodb';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, role, coins } = req.body;
    
    const uri = process.env.MONGO_URI;

    if (!uri) {
      return res.status(500).json({ message: 'Missing MONGO_URI environment variable' });
    }

    MongoClient.connect(uri)
      .then(client => {
        const db = client.db(); // Get the default database or specify a database name
        const membersCollection = db.collection('members');
        membersCollection.insertOne({ name, email, role, coins })
          .then(() => {
            res.status(200).json({ message: `Added ${name} to the team!` });
            client.close();
          })
          .catch(err => res.status(500).json({ message: 'Error adding member', error: err }));
      })
      .catch(err => res.status(500).json({ message: 'Error connecting to database', error: err }));
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}