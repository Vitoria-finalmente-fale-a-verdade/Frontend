import {RoleModel} from './role.model';

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  roles: RoleModel[];
}
