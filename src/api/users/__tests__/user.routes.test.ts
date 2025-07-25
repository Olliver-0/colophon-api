import supertest from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '#/app.js';
import prisma from '#/lib/prisma.js';

describe('User Routes', () => {
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

  describe('POST /api/users/register', () => {
    it('deve criar um novo usuário e retornar status 201', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await supertest(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
    });
  });
});
