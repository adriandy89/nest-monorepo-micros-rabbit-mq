import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      example: {
        username: 'string',
        password: 'string',
      },
    },
  })
  @Post('signin')
  async signIn(@Req() req) {
    return await this.authService.signIn(req.user);
  }

  // @Post('signup')
  // async signUp(@Body() userDTO: UserDTO) {
  //   if (userDTO.username == 'sadmin')
  //     handleError({ code: 409, message: 'Duplicate, already exist' });
  //   return await this.authService.signUp(userDTO);
  // }
}
