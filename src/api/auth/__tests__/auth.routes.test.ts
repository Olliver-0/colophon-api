import supertest from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '#/app.js';
import prisma from '#/lib/prisma.js';
import { hashPassword } from '#/utils/password.util.js';

describe('Auth Routes', () => {
  const userCredentials = {
    email: 'test.login@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    await prisma.bookshelfItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.user.deleteMany({});

    const hashedPassword = await hashPassword(userCredentials.password);
    await prisma.user.create({
      data: {
        name: 'Test Login User',
        email: 'test.login@example.com',
        password: hashedPassword,
      }
    })
  });

  afterAll(async () => {
    await prisma.bookshelfItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user and return 201 status', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await supertest(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate a user with valid credentials and return a JWT', async () => {
      const response = await supertest(app)
        .post('/api/auth/login')
        .send(userCredentials);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('token');
      expect(typeof response.body.data.token).toBe('string');
    });
  })
});
