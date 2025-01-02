import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { memberId, productId, quantity = 1 } = req.body;

    if (!memberId || !productId) {
      return res.status(400).json({ message: 'Member ID and Product ID are required' });
    }

    const { db } = await connectToDatabase();
    const membersCollection = db.collection('members');
    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');

    try {
      // Fetch member
      const member = await membersCollection.findOne({ _id: new ObjectId(memberId) });
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }

      // Fetch product
      const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
      if (!product || product.quantity < quantity) {
        return res.status(400).json({ message: 'Product not available or insufficient quantity' });
      }

      // Check member points
      const pointsField = product.currencyType === 'coins' ? 'points.myCoins' : 'points.myDiamonds';
      if (member.points[pointsField] < product.price * quantity) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Deduct points from member
      await membersCollection.updateOne(
        { _id: new ObjectId(memberId) },
        { $inc: { [pointsField]: -(product.price * quantity) } }
      );

      // Deduct product quantity
      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { quantity: -quantity } }
      );

      // Log the order
      const order = {
        memberId: new ObjectId(memberId),
        productId: new ObjectId(productId),
        quantity,
        totalCost: product.price * quantity,
        timestamp: new Date(),
      };
      await ordersCollection.insertOne(order);

      res.status(201).json({ message: 'Redemption successful', orderId: order._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}