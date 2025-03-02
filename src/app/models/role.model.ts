export interface RoleModel {
  id: string;
  name: string;
  normalizedName: string;
}

export enum Roles {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
