import { IUser } from '../enums/IUser';
declare module Express {
    export interface Request {
        user: IUser;
        fileName: string;
    }
}