import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Public } from '../../resources/decorators/public-route.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() { email, password }: SignInDto) {
    return this.authService.singIn(email, password);
  }

  /* Testing auth route */
  // @Get('profile')
  // getProfile(@Request() req: any) {
  //   return req.user;
  // }
}
