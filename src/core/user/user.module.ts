import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
