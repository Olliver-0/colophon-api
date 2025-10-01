// src/api/users/user.service.ts
import { PrismaClient } from '@prisma/client';
import { UserResponse } from '../auth/auth.types.js';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  public findUserById = async (id: string): Promise<UserResponse | null> => {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { password, ...userResponse } = user;
    return userResponse;
  };
}
