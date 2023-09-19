import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // regular `Socket` from socket.io is probably sufficient
    const socket = context.switchToWs().getClient();

    // for testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    if (!token) {
      this.logger.error('No authorization token provided');

      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);

      this.logger.debug(`Validating admin using token payload`, payload);

      return true;
    } catch {
      throw new UnauthorizedException('Admin privileges required');
    }
  }
}
