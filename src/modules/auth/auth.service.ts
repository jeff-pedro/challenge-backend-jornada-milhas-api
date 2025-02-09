import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  async login({ email, password }: CreateAuthDto) {
    return { message: 'Logged successfuly!' }
  }
}
