import { PrismaClient } from '@prisma/client';
import { hashPassword } from '#/utils/password.util.js';
import { User, UserResponse } from './auth.types.js';
import { AppError } from '#/utils/AppError.js';
import { CreateUserInput } from './auth.validation.js';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  public createUser = async (userData: CreateUserInput['body']): Promise<UserResponse> => {
    const existingUser: { email: string } | null = await this.prisma.user.findUnique({
      where: { email: userData.email },
      select: { email: true },
    });

    if (existingUser) {
      throw new AppError('This email already exists!', 409);
    }

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
}
