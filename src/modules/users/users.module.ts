import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsUniqueEmailConstraint } from './validations/unique-email.validator';
import { MulterModule } from '@nestjs/platform-express';
import { StorageConfig } from '../../config/modules/storage.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync(StorageConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService, IsUniqueEmailConstraint],
  exports: [UsersService]
})
export class UsersModule {}
