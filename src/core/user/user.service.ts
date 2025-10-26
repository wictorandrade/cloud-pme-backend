import { HashHelper } from '@common/helpers/hash.helper';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlredyHasAccountException } from './user.exceptions';
import { SecureUserReturn } from './user.interface';
import { UserRepository } from './user.repository';
import { User } from '@generated/prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasher: HashHelper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SecureUserReturn> {
    const { password, email, avatarUrl, ...rest } = createUserDto;

    const hashedPassword = password ? await this.hasher.hash(password) : null;

    try {
      await this.checkAlredyExist(email);

      return this.userRepository.create({
        ...rest,
        avatarUrl,
        password: hashedPassword,
        email,
      });
    } catch (e) {
      this.logger.error(`Error creating user ${e}`);
      throw e;
    }
  }

  async checkAlredyExist(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      this.logger.log(`User ${email} alredy exist`);
      throw new UserAlredyHasAccountException();
    }
  }

  async findToAuth(email: string): Promise<User | null> {
    try {
      return this.userRepository.findToAuth(email);
    } catch (e) {
      this.logger.error(`Error finding user to auth: ${e}`);
      throw e;
    }
  }
}
