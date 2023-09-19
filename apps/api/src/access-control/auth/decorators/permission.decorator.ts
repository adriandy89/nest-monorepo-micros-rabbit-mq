import { IPermission } from '@app/libs/common/interfaces/permission.interface';
import { SetMetadata } from '@nestjs/common';
export const Permissions = (permissions: Partial<IPermission>) =>
  SetMetadata('permissions', permissions);
