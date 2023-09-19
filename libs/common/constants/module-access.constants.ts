import { IPermission } from '../interfaces/permission.interface';

export type Permissions = 'list' | 'create' | 'update' | 'delete' | 'admin';

export const PERMISSIONS: Permissions[] = [
  'list',
  'create',
  'update',
  'delete',
  'admin',
];

export const ALL_PERMISSIONS: IPermission = {
  administration: PERMISSIONS,
  products: PERMISSIONS,
};
