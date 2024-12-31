import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';

export async function processRewardTransaction({ senderId, recipientId, currencyType, amount, message }) {
  const { db } = await connectToDatabase();
  const membersCollection = db.collection('members');
  const transactionsCollection = db.collection('transactions');

  const sender = await membersCollection.findOne({ _id: new ObjectId(senderId) });
  if (!sender) throw new Error('Sender not found');

  const recipient = await membersCollection.findOne({ _id: new ObjectId(recipientId) });
  if (!recipient) throw new Error('Recipient not found');

  const fieldToDeduct = currencyType === 'coins' ? 'points.giveCoins' : 'points.giveDiamonds';
  const fieldToAdd = currencyType === 'coins' ? 'points.myCoins' : 'points.myDiamonds';

  if (sender.points[fieldToDeduct] < amount) {
    throw new Error(`Not enough ${currencyType} to reward`);
  }

  await membersCollection.updateOne(
    { _id: new ObjectId(senderId) },
    { $inc: { [fieldToDeduct]: -amount } }
  );

  await membersCollection.updateOne(
    { _id: new ObjectId(recipientId) },
    { $inc: { [fieldToAdd]: amount } }
  );

  await transactionsCollection.insertOne({
    senderId,
    recipientId,
    currencyType,
    amount,
    message,
    timestamp: new Date(),
  });

  return `Successfully rewarded ${amount} ${currencyType}`;
}