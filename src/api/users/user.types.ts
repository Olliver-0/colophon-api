import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export type UserData = Pick<PrismaUser, 'name' | 'email' | 'password'>;

export type UserResponse = Omit<PrismaUser, 'password'>;
