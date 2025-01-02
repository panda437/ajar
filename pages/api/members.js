import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid'; // To generate unique employee IDs

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  console.log('Request method:', req.method);

  let client;

  try {
    // Connect to MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db('AJAR');
    const collection = db.collection('members');

    // ---- Handle GET (list members) ----
    if (req.method === 'GET') {
      const { email, id } = req.query;
    
      if (email) {
        const member = await collection.findOne({ email });
        if (!member) {
          return res.status(404).json({ message: 'Member not found' });
        }
        return res.status(200).json(member);
      }
    
      if (id) {
        const member = await collection.findOne({ _id: new ObjectId(id) });
        if (!member) {
          return res.status(404).json({ message: 'Member not found' });
        }
        return res.status(200).json(member);
      }
    
      // If no query, return all members
      const members = await collection.find({}).toArray();
      return res.status(200).json(members);
    }

    // ---- Handle POST (sign up a new member) ----
    if (req.method === 'POST') {
      const { name, email, phone, password, company, team } = req.body;

      // Basic validations
      if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check for existing member with the same email
      const existingMember = await collection.findOne({ email });
      if (existingMember) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Generate employeeId
      const employeeId = `EMP-${nanoid(6).toUpperCase()}`;

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      const newMember = {
        name,
        email,
        phone,
        password: hashedPassword, // Store the hashed password
        employeeId,
        role: 'Employee', // Default role
        team: team || null, // Optional team
        points: {
          myCoins: 0,
          myDiamonds: 0,
          giveCoins: 0,
          giveDiamonds: 0,
        },
        company,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(newMember);
      return res.status(201).json({
        message: 'Sign-up successful',
        userId: result.insertedId,
        employeeId,
      });
    }

    // ---- If any other method, return 405 (Method Not Allowed) ----
    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error.message);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  } finally {
    // Always close the DB connection if it was opened
    if (client) {
      client.close();
    }
  }
}