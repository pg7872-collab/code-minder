import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import { Question } from '../src/models/Question.js';

let mongoServer;
let user1Token;
let user2Token;
let user1Id;
let user2Id;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create User 1
  const u1 = await request(app).post('/api/auth/register').send({
    name: 'Alice',
    email: 'alice@test.com',
    password: 'password123',
  });
  user1Token = u1.body.token;
  user1Id = u1.body.data.user._id;

  // Create User 2
  const u2 = await request(app).post('/api/auth/register').send({
    name: 'Bob',
    email: 'bob@test.com',
    password: 'password123',
  });
  user2Token = u2.body.token;
  user2Id = u2.body.data.user._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Question.deleteMany({});
});

describe('Question Tracker API Endpoints & Authorization', () => {
  it('should create a new question for authenticated user', async () => {
    const res = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Binary Search',
        platform: 'LeetCode',
        difficulty: 'Easy',
        topic: 'Binary Search',
        status: 'Solved',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Binary Search');
    expect(res.body.data.user).toBe(user1Id);
  });

  it('should filter questions by topic and difficulty', async () => {
    await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'Q1', difficulty: 'Easy', topic: 'Arrays' });

    await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'Q2', difficulty: 'Hard', topic: 'Dynamic Programming' });

    const res = await request(app)
      .get('/api/questions?topic=Arrays')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Q1');
  });

  it('should prevent User 2 from updating or deleting User 1 question', async () => {
    // User 1 creates question
    const createRes = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'Private Problem', difficulty: 'Medium', topic: 'Graphs' });

    const questionId = createRes.body.data._id;

    // User 2 tries to update
    const editRes = await request(app)
      .put(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ title: 'Hacked Title' });

    expect(editRes.status).toBe(403);

    // User 2 tries to delete
    const deleteRes = await request(app)
      .delete(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(deleteRes.status).toBe(403);
  });

  it('should allow owner to delete question', async () => {
    const createRes = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'To Delete', difficulty: 'Easy', topic: 'Stack' });

    const questionId = createRes.body.data._id;

    const deleteRes = await request(app)
      .delete(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const checkRes = await request(app)
      .get(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(checkRes.status).toBe(404);
  });
});
