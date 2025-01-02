import { MongoClient, ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  let client;
  try {
    // Connect to MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db('AJAR');
    const collection = db.collection('products');

    if (req.method === 'GET') {
        const products = await collection.find({ quantity: { $gt: 0 } }).toArray();
        return res.status(200).json(products);
      }

    if (req.method === 'POST') {
      const { name, price, quantity, discount = 0, description, eligibility, organization, addedBy } = req.body;

      // Validation
      if (!name || !price || !quantity || !description || !organization || !addedBy) {
        return res.status(400).json({ message: 'Name, price, quantity, description, organization, and addedBy are required.' });
      }

      const newProduct = {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        discount: parseFloat(discount),
        description,
        eligibility: eligibility || 'All', // Default to all teams if not provided
        organization,
        addedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newProduct);
      return res.status(201).json({ message: 'Product added successfully', productId: result.insertedId });
    }

    if (req.method === 'PUT') {
      const { productId, name, price, quantity, discount, description, eligibility } = req.body;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
      }

      const updateFields = {};
      if (name) updateFields.name = name;
      if (price !== undefined) updateFields.price = parseFloat(price);
      if (quantity !== undefined) updateFields.quantity = parseInt(quantity, 10);
      if (discount !== undefined) updateFields.discount = parseFloat(discount);
      if (description) updateFields.description = description;
      if (eligibility) updateFields.eligibility = eligibility;
      updateFields.updatedAt = new Date();

      const result = await collection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: updateFields }
      );

      return res.status(200).json({ message: 'Product updated successfully', result });
    }

    if (req.method === 'DELETE') {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
      }

      const result = await collection.deleteOne({ _id: new ObjectId(productId) });
      return res.status(200).json({ message: 'Product deleted successfully', result });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  } finally {
    if (client) client.close();
  }
}