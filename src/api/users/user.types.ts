import { User as PrismaUser } from '@prisma/client';
import { BookshelfItem as PrismaBookshelfItem } from '@prisma/client';

export type User = PrismaUser;
export type UserResponse = Omit<PrismaUser, 'password'>;
export type BookshelfItem = PrismaBookshelfItem;
