import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Public } from '../../common/decorators/public-route.decorator';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 
   * Login a user
   * 
   * @remarks This operation allows you to log in as a user and receive an access token.
   * 
   * @throws {400} Malformatted request body, invalid input.
   * @throws {401} Unauthorized. User or password invalid. 
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ 
    description: 'Successful operation.', 
    example: { access_token: 'string' } 
  })
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
