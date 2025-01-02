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
      const usersCollection = db.collection('members');

      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase();

      // Find user by email
      const user = await usersCollection.findOne({ email: normalizedEmail });
      console.log('User found:', user); // Debug log
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch); // Debug log
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      // Success
      res.status(200).json({
        message: 'Login successful',
        userId: user._id,
        name: user.name,
        email: user.email, // Include email here
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}