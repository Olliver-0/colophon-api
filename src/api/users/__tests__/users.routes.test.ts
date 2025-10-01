import supertest from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import app from '#/app.js';
import prisma from '#/lib/prisma.js';
import { hashPassword } from '#/utils/password.util.js';

describe('User Routes', () => {
  beforeEach(async () => {
    await prisma.bookshelfItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/users/me', () => {
    it('should return the user data for an authenticated request', async () => {
      const credentials = {
        email: 'me.test@example.com',
        password: 'password123',
      };
      const hashedPassword = await hashPassword(credentials.password);
      const user = await prisma.user.create({
        data: {
          name: 'Me Test User',
          email: credentials.email,
          password: hashedPassword,
        },
      });

      const agent = supertest.agent(app);

      await agent.post('/api/auth/login').send(credentials);

      const response = await agent.get('/api/users/me');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(user.id);
      expect(response.body.data.email).toBe(user.email);
      expect(response.body.data.password).toBeUndefined(); 
    });

    it('should return an 401 error for a unauthenticated request', async () => {
      const response = await supertest(app).get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided, authorization denied.');
    });
  });
});
