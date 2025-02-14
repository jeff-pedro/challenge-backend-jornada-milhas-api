import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export interface UserPayload {
  sub: string,
  username: string
}

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UsersService,
    private jwtService: JwtService
  ) {}

  async singIn(email: string, password: string): Promise<{ access_token: string } | undefined> {
    try {
      const user = await this.userService.findByEmail(email);
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        throw new UnauthorizedException('Incorrect user or password.');
      }

      const username = `${user.firstName}.${user.lastName}`.toLowerCase()
      const payload: UserPayload = { sub: user.id, username }     
      
      const token = await this.jwtService.signAsync(payload);

      return { access_token: token }; 
    } catch (error) {
      if(error instanceof NotFoundException) {
        throw new UnauthorizedException('Incorrect user or password.')
      }
      throw error;
    }
  }
}
