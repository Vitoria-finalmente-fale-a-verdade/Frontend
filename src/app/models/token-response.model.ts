import {UserModel} from './user.model';

export interface TokenResponseModel {
  token: string;
  expiresIn: number;
  user: UserModel;
}
