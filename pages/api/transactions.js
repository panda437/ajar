import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    console.log('Request method:', req.method);

    if (req.method === 'POST') {
      const { senderId, recipientId, currencyType, amount, message } = req.body;
      const numericAmount = parseFloat(amount);
      console.log('Request body:', req.body);

      // Validate input
      if (!recipientId || !currencyType || numericAmount <= 0) {
        console.error('Invalid input:', { recipientId, currencyType, amount });
        return res.status(400).json({ message: 'Missing or invalid required fields' });
      }

      const { db } = await connectToDatabase();
      const membersCollection = db.collection('members');
      const transactionsCollection = db.collection('transactions');

      // Validate recipient exists
      const recipient = await membersCollection.findOne({ _id: new ObjectId(recipientId) });
      if (!recipient) {
        console.error('Recipient not found:', recipientId);
        return res.status(404).json({ message: 'Recipient not found' });
      }

      // Validate sender and deduct from balance
      if (senderId) {
        const sender = await membersCollection.findOne({ _id: new ObjectId(senderId) });
        if (!sender) {
          console.error('Sender not found:', senderId);
          return res.status(404).json({ message: 'Sender not found' });
        }

        const giveField = currencyType === 'coins' ? 'points.giveCoins' : 'points.giveDiamonds';

        console.log('Sender data:', sender);
        console.log('Field to deduct:', giveField);
        console.log('Sender balance:', sender.points?.[giveField]);
        console.log('Amount requested:', numericAmount);

        if (!sender.points || sender.points[giveField] === undefined) {
          return res.status(400).json({ message: 'Sender points data is missing or invalid' });
        }

        if (sender.points[giveField] < numericAmount) {
          console.error(`Insufficient balance: ${sender.points[giveField]} < ${numericAmount}`);
          return res.status(400).json({
            message: `Not enough ${currencyType} to reward. Balance: ${sender.points[giveField]}`,
          });
        }

        await membersCollection.updateOne(
          { _id: new ObjectId(senderId) },
          { $inc: { [giveField]: -numericAmount } }
        );
      }

      // Create transaction
      const transaction = {
        senderId: senderId ? new ObjectId(senderId) : null,
        recipientId: new ObjectId(recipientId),
        currencyType,
        amount: numericAmount,
        message,
        timestamp: new Date(),
      };

      const result = await transactionsCollection.insertOne(transaction);
      console.log('Transaction created:', result);

      // Update recipient's points
      const pointsField = currencyType === 'coins' ? 'points.myCoins' : 'points.myDiamonds';
      const updateResult = await membersCollection.updateOne(
        { _id: new ObjectId(recipientId) },
        { $inc: { [pointsField]: numericAmount } }
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