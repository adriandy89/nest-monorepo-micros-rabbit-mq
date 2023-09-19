import { IUserPayload } from '@app/libs/common/interfaces/user-payload.interface';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new InternalServerErrorException('user out of context');
    }
    const user: IUserPayload = request.user;

    return { userId: user.userId, organization: user.organization };
  },
);
