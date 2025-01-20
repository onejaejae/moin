import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInBody } from './dto/req/signIn.body';
import { SignUpBody } from './dto/req/signUp.body';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: SignUpBody): Promise<void> {
    await this.service.signUp(body);
  }

  @Post('/signin')
  async signIn(@Body() body: SignInBody) {
    const accessToken = await this.service.signIn(body);

    return { accessToken };
  }
}
