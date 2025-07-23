import { PrismaClient } from '@prisma/client';
import { hashPassword } from '#/utils/password.util.js';
import { UserData, User, UserResponse } from './user.types.js';

class UserService {
  constructor(private prisma: PrismaClient) {}

  public createUser = async (userData: UserData): Promise<UserResponse> => {
    const existingUser: { email: string } | null = await this.prisma.user.findUnique({
      where: { email: userData.email },
      select: { email: true },
    });

    if (existingUser) {
      throw new Error('This email already exists!');
    }

    const hashedPassword = await hashPassword(userData.password);

    const newUser: User = await this.prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      },
    });

    const { password, ...createdUser } = newUser;

    return createdUser;
  };
}

export default UserService;
