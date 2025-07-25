import supertest from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '#/app.js';
import prisma from '#/lib/prisma.js';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await prisma.bookshelfItem.deleteMany({});
    await prisma.review.deleteMany({});

    await prisma.user.deleteMany({});
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
});
