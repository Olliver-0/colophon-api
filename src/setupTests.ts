// src/setupTests.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
