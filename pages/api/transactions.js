import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getTransactions(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Fetch transactions and join sender/recipient names
async function getTransactions(req, res) {
  try {
    const { db } = await connectToDatabase();
    const transactionsColl = db.collection('transactions');
    const membersColl = db.collection('members');

    // Fetch all transactions
    const transactions = await transactionsColl.find({}).toArray();

    // Fetch all member data for mapping IDs to names
    const members = await membersColl.find({}).toArray();
    const memberMap = {};
    members.forEach((member) => {
      memberMap[member._id.toString()] = member.name; // Create a map of ID -> Name
    });

    // Replace IDs with names
    const enhancedTransactions = transactions.map((tx) => ({
      ...tx,
      recipientName: memberMap[tx.recipientId?.toString()] || 'Unknown Recipient',
      senderName: memberMap[tx.senderId?.toString()] || 'System',
    }));

    res.status(200).json(enhancedTransactions);
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
