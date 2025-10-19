import { User as PrismaUser } from '@prisma/client';
import { BookshelfItem as PrismaBookShelfItem } from '@prisma/client';

export type User = PrismaUser;
export type UserResponse = Omit<PrismaUser, 'password'>;
export type BookShelfItem = PrismaBookShelfItem;
