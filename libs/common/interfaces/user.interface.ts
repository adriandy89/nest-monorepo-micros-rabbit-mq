import { IOrganization } from './organization.interface';
import { IRole } from './role.interface';

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  organization: string | IOrganization;
  role: string | IRole;
  active?: boolean;
}
