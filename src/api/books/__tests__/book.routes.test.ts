import supertest from 'supertest';
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import axios from 'axios';
import app from '#/app.js';
import prisma from '#/lib/prisma.js';
import { hashPassword } from '#/utils/password.util.js';

vi.mock('axios');

describe('Book Routes', () => {
  let agent: supertest.Agent;

  beforeEach(async () => {
    await prisma.bookshelfItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.user.deleteMany({});
    
    const credentials = {
      email: 'book.test@example.com',
      password: 'password123',
    };
    const hashedPassword = await hashPassword(credentials.password);
    await prisma.user.create({
      data: {
        name: 'Book Test User',
        email: credentials.email,
        password: hashedPassword,
      },
    });

  agent = supertest.agent(app);
    await agent.post('/api/auth/login').send(credentials);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/books/search', () => {
    it('should return formatted books on successful search', async () => {
      const mockGoogleApiData = {
        items: [
          {
            id: '123',
            volumeInfo: {
              title: 'Mock Book Title',
              authors: ['Mock Author'],
              publishedDate: '2025-01-01',
              description: 'A mock description.',
              imageLinks: {
                thumbnail: 'http://example.com/thumbnail.jpg'
              }
            },
          },
        ],
      };

      vi.mocked(axios.get).mockResolvedValue({
        data: mockGoogleApiData,
        status: 200,
        statusText: 'OK',
        headers: {},
  config: { url: 'http://mock-url' },
      });

      const response = await agent.get('/api/books/search?q=testing');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data[0]).toHaveProperty('googleBooksId', '123');
      expect(response.body.data[0]).toHaveProperty('title', 'Mock Book Title');
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await supertest(app).get('/api/books/search?q=testing');
      expect(response.status).toBe(401);
    });

    it('should return 400 if search query "q" is missing', async () => {
      const response = await agent.get('/api/books/search');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });

    it('should return 500 if Google Books API call fails', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

      const response = await agent.get('/api/books/search?q=testing');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch books from Google Books API.');
    });
  });
});
