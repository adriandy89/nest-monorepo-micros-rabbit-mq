import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class SAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user?.username === 'sadmin') {
      return true;
    }
    return false;
  }
}
