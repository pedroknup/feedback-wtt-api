/* eslint-disable import/extensions */
import { DBService } from './db.service'
import UserSheet from './sheets/user.sheet';
import { Config } from '../config';

export class AdminService {
  public static baseURL = '/admin'

  private static userSpreadsheetManager = new UserSheet({
    clientEmail: Config.clientEmail,
    privateKey: Config.privateKey,
  })
  static async getUsers() {
    return await DBService.getAllUsers()
  }

  static async refreshUsers() {
    await DBService.deleteAllUsers()
    const newUsers = await AdminService.userSpreadsheetManager.loadUsers()
    return await DBService.addUsers(newUsers)
  }
}
