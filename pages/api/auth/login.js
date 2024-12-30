import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection('users');

      // Find user by email
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      res.status(200).json({ message: 'Login successful', userId: user._id, name: user.name });
    } catch (error) {
      console.error('Login error:', error);
      console.log('cards')
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}