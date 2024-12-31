import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import handler from '../pages/api/members';

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

describe('Members API', () => {
  it('should add a new member', async () => {
    const req = {
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
        company: 'Ajar',
        team: 'Engineering',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Sign-up successful',
        userId: expect.anything(),
        employeeId: expect.stringMatching(/^EMP-/),
      })
    );
  });

  it('should return all members', async () => {
    const req = { method: 'GET' };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });
});