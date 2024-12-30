import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection('users');

      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to the database
      const newUser = await usersCollection.insertOne({
        email,
        name,
        password: hashedPassword,
        createdAt: new Date(),
      });
      console.log(newUser)

      res.status(201).json({ message: 'User created successfully', userId: newUser.insertedId });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}