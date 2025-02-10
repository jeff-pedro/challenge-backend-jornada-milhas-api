import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor (private readonly userService: UsersService) {}

  async login({ email, password }: CreateAuthDto) {
    const user = await this.userService.findByEmail(email);

    const hashedPassoword = user.password;

    const isMatch = await bcrypt.compare(password, hashedPassoword);
    
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect user or password!');
    }

    return user;
  }
}
