// pages/api/members.js

import { MongoClient } from 'mongodb';

export const config = {
  api: {
    bodyParser: true, // ensures the request body is parsed
  },
};

export default async function handler(req, res) {
  console.log('Request method:', req.method);

  let client;

  try {
    // Connect to MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db('AJAR');
    const collection = db.collection('members');

    // ---- Handle GET (list members) ----
    if (req.method === 'GET') {
      const members = await collection.find({}).toArray();
      return res.status(200).json(members);
    }

    // ---- Handle POST (add a member) ----
    if (req.method === 'POST') {
      const { name, email, phone, coins, diamonds, company } = req.body;

      // Basic validations
      if (!name || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newMember = {
        name,
        email,
        phone,
        coins: coins || 0,
        diamonds: diamonds || 0,
        createdAt: new Date(),
        company,
      };

      const result = await collection.insertOne(newMember);
      return res.status(201).json({
        message: 'Member added successfully',
        result,
      });
    }

    // ---- If any other method, return 405 (Method Not Allowed) ----
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Database error:', error.message);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  } finally {
    // Always close the DB connection if it was opened
    if (client) {
      client.close();
    }
  }
}
