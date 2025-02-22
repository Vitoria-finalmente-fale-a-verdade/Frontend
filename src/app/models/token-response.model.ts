import {User} from './user.model';

export interface TokenResponse {
  token: string;
  expiresIn: number;
  user: User;
}
