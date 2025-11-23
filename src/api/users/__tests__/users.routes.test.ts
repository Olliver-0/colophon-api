import supertest from 'supertest';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import axios from 'axios';
import app from '#/app.js';
import prisma from '#/lib/prisma.js';
import { hashPassword } from '#/utils/password.util.js';

vi.mock('axios');

describe('User Routes', () => {
  let agent: supertest.Agent;
  let userId: string;

  beforeEach(async () => {
    await prisma.bookshelfItem.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.user.deleteMany({});

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
    userId = user.id;

    agent = supertest.agent(app);
    await agent.post('/api/auth/login').send(credentials);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/users/me', () => {
    it('should return the user data for an authenticated request', async () => {
      const response = await agent.get('/api/users/me');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe('me.test@example.com');
    });

    it('should return a 401 error for an unauthenticated request', async () => {
      const response = await supertest(app).get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided, authorization denied.');
    });
  });

  describe('POST /api/users/me/bookshelf', () => {
    it('should add a new book to the user bookshelf and return 201', async () => {
      const mockGoogleApiData = {
        id: 'mock-google-id',
        volumeInfo: { title: 'Mock Book Title' },
      };

      vi.mocked(axios.get).mockResolvedValue({
        data: mockGoogleApiData,
        status: 200,
        statusText: 'OK',
        headers: {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: {} as any,
      });

      const bookshelfData = {
        googleBooksId: 'mock-google-id',
        status: 'WantToRead',
      };

      const response = await agent.post('/api/users/me/bookshelf').send(bookshelfData);

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe('WantToRead');
      expect(response.body.data.userId).toBe(userId);

      const bookInDb = await prisma.book.findUnique({ where: { googleBooksId: 'mock-google-id' } });
      expect(bookInDb).not.toBeNull();
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await supertest(app).post('/api/users/me/bookshelf').send({
        googleBooksId: 'mock-google-id',
        status: 'WantToRead',
      });
      expect(response.status).toBe(401);
    });

    it('should return 400 if validation fails (missing status)', async () => {
      const response = await agent.post('/api/users/me/bookshelf').send({ googleBooksId: 'mock-google-id' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/users/me/bookshelf', () => {
    it('should return a list of bookshelf items for the authenticated user', async () => {
      const book1 = await prisma.book.create({
        data: {
          googleBooksId: 'book-1',
          title: 'Book One',
          authors: ['Author A'],
        },
      });

      const book2 = await prisma.book.create({
        data: {
          googleBooksId: 'book-2',
          title: 'Book Two',
          authors: ['Author B'],
        },
      });

      await prisma.bookshelfItem.create({
        data: {
          userId,
          bookId: book1.id,
          status: 'Read',
        },
      });

      await prisma.bookshelfItem.create({
        data: {
          userId: userId,
          bookId: book2.id,
          status: 'Want to Read',
        },
      });

      const response = await agent.get('/api/users/me/bookshelf');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(2);

      expect(response.body.data[0].status).toBe('Read');
      expect(response.body.data[0].book.title).toBe('Book One');
      expect(response.body.data[1].status).toBe('Want to Read');
      expect(response.body.data[1].book.title).toBe('Book Two');
    });

    it('should return an empty array if the user has no books on the shelf', async () => {
      const response = await agent.get('/api/users/me/bookshelf');

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await supertest(app).get('/api/users/me/bookshelf');

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/users/me/bookshelf/:itemId', () => {
    it('should update the status of a bookshelf item and return 200', async () => {
      const book = await prisma.book.create({
        data: {
          googleBooksId: 'book-to-update',
          title: 'Book To Update',
          authors: ['Author'],
        },
      });

      const originalItem = await prisma.bookshelfItem.create({
        data: {
          userId: userId,
          bookId: book.id,
          status: 'WantToRead',
        },
      });

      const response = await agent
        .patch(`/api/users/me/bookshelf/${originalItem.id}`)
        .send({ status: 'Reading' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(originalItem.id);
      expect(response.body.data.status).toBe('Reading');

      const updatedItemInDb = await prisma.bookshelfItem.findUnique({
        where: { id: originalItem.id },
      });
      expect(updatedItemInDb?.status).toBe('Reading');
    });

    it('should return 404 if the item does not exist', async () => {
      const fakeId = '000000000000000000000000'; 
      const response = await agent
        .patch(`/api/users/me/bookshelf/${fakeId}`)
        .send({ status: 'Read' });

      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });

    it('should return 404 if the item belongs to another user', async () => {
      const otherUser = await prisma.user.create({
        data: {
          email: 'other@example.com',
          password: 'pass',
          name: 'Other',
        },
      });

      const book = await prisma.book.create({
        data: { googleBooksId: 'other-book', title: 'Other Book', authors: [] },
      });
      
      const otherUserItem = await prisma.bookshelfItem.create({
        data: {
          userId: otherUser.id,
          bookId: book.id,
          status: 'WantToRead',
        },
      });

      const response = await agent
        .patch(`/api/users/me/bookshelf/${otherUserItem.id}`)
        .send({ status: 'Read' });

      expect(response.status).toBe(404);
    });

    it('should return 400 if status is invalid', async () => {
      const book = await prisma.book.create({
        data: { googleBooksId: 'valid-book', title: 'Book', authors: [] },
      });
      const item = await prisma.bookshelfItem.create({
        data: { userId, bookId: book.id, status: 'WantToRead' },
      });

      const response = await agent
        .patch(`/api/users/me/bookshelf/${item.id}`)
        .send({ status: 'InvalidStatus' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await supertest(app)
        .patch('/api/users/me/bookshelf/any-id')
        .send({ status: 'Read' });

      expect(response.status).toBe(401);
    });
  });
});
