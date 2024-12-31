import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    console.log('Request method:', req.method);

    if (req.method === 'POST') {
      const { recipientId, currencyType, amount, message } = req.body;

      console.log('Request body:', req.body);

      // Validate input
      if (!recipientId || !currencyType || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const { db } = await connectToDatabase();
      const membersCollection = db.collection('members');
      const transactionsCollection = db.collection('transactions');

      // 1. Validate recipient exists
      const recipient = await membersCollection.findOne({ _id: new ObjectId(recipientId) });
      if (!recipient) {
        console.error('Recipient not found:', recipientId);
        return res.status(404).json({ message: 'Recipient not found' });
      }

      console.log('Recipient found:', recipient);

      // 2. Create transaction
      const transaction = {
        recipientId: new ObjectId(recipientId),
        currencyType,
        amount: parseInt(amount, 10),
        message,
        timestamp: new Date(),
      };

      const result = await transactionsCollection.insertOne(transaction);
      console.log('Transaction created:', result);

      // 3. Update recipient's points
      const pointsField = currencyType === 'coins' ? 'points.coins' : 'points.diamonds';
      const updateResult = await membersCollection.updateOne(
        { _id: new ObjectId(recipientId) },
        { $inc: { [pointsField]: transaction.amount } }
      );
      console.log('Recipient points updated:', updateResult);

      return res.status(201).json({ message: 'Transaction successful', transactionId: result.insertedId });
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}