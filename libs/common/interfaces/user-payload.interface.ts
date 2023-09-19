import { IPermission } from './permission.interface';

export interface IUserPayload {
  username: string;
  userId?: string;
  permissions?: IPermission;
  organization?: string;
  iat?: number;
  exp?: number;
}
