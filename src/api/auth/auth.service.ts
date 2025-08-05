import { PrismaClient } from '@prisma/client';
import { comparePassword, hashPassword } from '#/utils/password.util.js';
import { User, UserResponse } from './auth.types.js';
import { AppError } from '#/utils/AppError.js';
import { AuthenticateUserInput, CreateUserInput } from './auth.validation.js';
import jwt from 'jsonwebtoken';
import config from '#/config/index.js';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  public createUser = async (userData: CreateUserInput['body']): Promise<UserResponse> => {
    const existingUser: { email: string } | null = await this.prisma.user.findUnique({
      where: { email: userData.email },
      select: { email: true },
    });

    if (existingUser) throw new AppError('This email already exists!', 409);

    const hashedPassword = await hashPassword(userData.password);

    const userRecord: User = await this.prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      },
    });

    const { password, ...userResponse } = userRecord;

    return userResponse;
  };

  public authenticateUser = async (userData: AuthenticateUserInput['body']): Promise<string> => {
    const INVALID_CREDENTIALS_ERROR = new AppError('Invalid credentials', 401);

    const user: { id: string; email: string; password: string } | null = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) throw INVALID_CREDENTIALS_ERROR;

    const isPasswordMatch = await comparePassword(userData.password, user.password);

    if (!isPasswordMatch) throw INVALID_CREDENTIALS_ERROR;

    const token = jwt.sign({ id: user.id }, config.auth.jwtSecret, { expiresIn: '7d' });

    return token;
  };
}
