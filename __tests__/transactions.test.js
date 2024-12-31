import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import handler from '../pages/api/transactions';

let mongoServer;
let client;
let db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  client = await MongoClient.connect(mongoServer.getUri(), {});
  db = client.db('test');
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('Transactions API', () => {
  it('should fail if recipient does not exist', async () => {
    const req = {
      method: 'POST',
      body: {
        senderId: '60d21b4667d0d8992e610c85',
        recipientId: 'nonexistent',
        currencyType: 'coins',
        amount: 100,
        message: 'Great job!',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Recipient not found' })
    );
  });
});