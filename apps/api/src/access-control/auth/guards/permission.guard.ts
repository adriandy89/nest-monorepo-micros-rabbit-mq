import { IPermission } from '@app/libs/common/interfaces/permission.interface';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<IPermission>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (user?.username === 'sadmin') {
      return true;
    }
    if (!user || !user.permissions) {
      return false;
    }
    const userPermissions: IPermission = user.permissions;
    return this.compareObjectProperties(requiredPermissions, userPermissions);
  }

  compareObjectProperties(
    required: Partial<IPermission>,
    actually: Partial<IPermission>,
  ): boolean {
    for (const key1 in required) {
      if (actually.hasOwnProperty(key1)) {
        const arr1 = required[key1];
        const arr2 = actually[key1];
        if (!arr2.includes('admin')) {
          for (const element1 of arr1) {
            if (!arr2.includes(element1)) {
              return false;
            }
          }
        }
      } else {
        return false;
      }
    }
    return true;
  }
}
