import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyAPI } from '../common/proxy/client-proxy';
import { firstValueFrom } from 'rxjs';
import { UserMsg } from '@app/libs/common/constants/rabbitmq.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyAPI,
    private readonly jwtService: JwtService,
  ) {}

  private clientProxyAccessControl =
    this.clientProxy.clientProxyAccessControl();
  async validateUser(username: string, password: string): Promise<any> {
    const r = this.clientProxyAccessControl.send(UserMsg.VALID_USER, {
      username,
      password,
    });
    const user = await firstValueFrom(r);

    if (user) return user;

    return null;
  }

  async signIn(user: any) {
    if (user?.username === 'sadmin') {
      return {
        access_token: this.jwtService.sign({ username: user.username }),
      };
    }
    const payload = {
      username: user.username,
      userId: user._id,
      permissions: user.role.permissions,
      organization: user.organization,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  // async signUp(userDTO: UserDTO) {
  //   return await this.clientProxyAccessControl
  //     .send(UserMsg.CREATE, userDTO)
  //     .toPromise();
  // }
}
