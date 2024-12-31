import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    console.log('Request method:', req.method);

    if (req.method === 'POST') {
      const { senderId, recipientId, currencyType, amount, message } = req.body;

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

      // 2. If senderId is provided, validate sender and deduct from "give" balance
      if (senderId) {
        const sender = await membersCollection.findOne({ _id: new ObjectId(senderId) });
        if (!sender) {
          console.error('Sender not found:', senderId);
          return res.status(404).json({ message: 'Sender not found' });
        }

        const giveField = currencyType === 'coins' ? 'points.giveCoins' : 'points.giveDiamonds';

        if (sender.points[giveField] < amount) {
          return res.status(400).json({ message: `Not enough ${currencyType} to reward` });
        }

        await membersCollection.updateOne(
          { _id: new ObjectId(senderId) },
          { $inc: { [giveField]: -amount } }
        );
      }

      // 3. Create transaction
      const transaction = {
        senderId: senderId ? new ObjectId(senderId) : null,
        recipientId: new ObjectId(recipientId),
        currencyType,
        amount: parseInt(amount, 10),
        message,
        timestamp: new Date(),
      };

      const result = await transactionsCollection.insertOne(transaction);
      console.log('Transaction created:', result);

      // 4. Update recipient's points
      const pointsField = currencyType === 'coins' ? 'points.myCoins' : 'points.myDiamonds';
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