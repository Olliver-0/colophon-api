import supertest from 'supertest';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import app from '#/app.js';
import prisma from '#/lib/prisma.js';
import { hashPassword } from '#/utils/password.util.js';

describe('Auth Routes', () => {
  beforeEach(async () => {
    await prisma.bookshelfItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user and return 201 status', async () => {
      const userData = {
        name: 'Test User Register',
        email: 'register@example.com',
        password: 'password123',
      };

      const response = await supertest(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');

      const userInDb = await prisma.user.findUnique({ where: { email: userData.email } });
      expect(userInDb).not.toBeNull();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate a user and set a secure cookie', async () => {
      // Arrange: Crie o usuário necessário para ESTE teste específico
      const credentials = {
        email: 'login.test@example.com',
        password: 'password123',
      };

      const hashedPassword = await hashPassword(credentials.password);

      await prisma.user.create({
        data: {
          name: 'Login Test User',
          email: credentials.email,
          password: hashedPassword,
        },
      });

      const response = await supertest(app)
        .post('/api/auth/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged in successfully');
      expect(response.body.data).toBeUndefined();

      const cookieHeader = response.headers['set-cookie'];
      expect(cookieHeader).toBeDefined();
      expect(cookieHeader[0]).toMatch(/accessToken=/);
      expect(cookieHeader[0]).toMatch(/HttpOnly/);
      expect(cookieHeader[0]).toMatch(/SameSite=Strict/);
    });
  });
});
