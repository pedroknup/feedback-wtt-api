declare namespace Express {
import { IUser } from './src/models/IUser';
  export interface Request {
      user: IUser;
  }
  export interface Response {
      user: string;
  }
}