import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { SecureUserReturn } from '@core/user/user.interface';
import { UserUncheckedCreateInput } from '@generated/prisma/models/User';
import { User } from '@generated/prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserUncheckedCreateInput): Promise<SecureUserReturn> {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<SecureUserReturn | null> {
    return this.prisma.user.findUnique({
      select: {
        id: true,
        displayName: true,
        firstName: true,
        lastName: true,
        email: true,
        googleId: true,
        avatarUrl: true,
        role: true,
      },
      where: { email },
    });
  }

  async findToAuth(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
