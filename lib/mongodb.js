import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; 
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local as MONGODB_URI');
}

/**
 * In development mode, use a global variable so we can reuse the connection.
 * This prevents connections growing exponentially during API Route usage.
 */
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, use a new client
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('AJAR'); // or your preferred DB name
  return { client, db };
}
