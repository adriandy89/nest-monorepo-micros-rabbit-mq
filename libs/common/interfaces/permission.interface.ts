import { Permissions } from '../constants/module-access.constants';

export interface IPermission {
  administration: Permissions[];
  products: Permissions[];
}
