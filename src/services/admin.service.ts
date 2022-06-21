/* eslint-disable import/extensions */
import { DBService } from './db.service'
import credentials from '../credentials.json'
import UserSheet from './sheets/user.sheet';

export class AdminService {
  public static baseURL = '/admin'

  private static userSpreadsheetManager = new UserSheet({
    clientEmail: credentials.client_email,
    privateKey: credentials.private_key,
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
