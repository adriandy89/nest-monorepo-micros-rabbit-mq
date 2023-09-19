import { IPermission } from './permission.interface';

export interface IRole {
  name: string;
  permissions: IPermission;
}
