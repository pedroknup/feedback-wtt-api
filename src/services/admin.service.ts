/* eslint-disable import/extensions */
import { DBService } from './db.service'
import UserSheet from './sheets/user.sheet'
import { Config } from '../config'
import { QAService } from './qa.service'
import { IQA } from 'src/models/IQA'

export class AdminService {
  public static baseURL = '/admin'

  private static userSpreadsheetManager = new UserSheet({
    clientEmail: Config.clientEmail,
    privateKey: Config.privateKey,
    spreadSheetId: Config.spreadSheet,
    tabName: 'users',
  })

  static async getUsers() {
    return await DBService.getAllUsers()
  }

  static async refreshUsers() {
    await DBService.deleteAllUsers()
    const newUsers = await AdminService.userSpreadsheetManager.loadUsers()
    const questions = await QAService.fetchQuestions()
    await DBService.addUsers(newUsers)
    await DBService.deleteAllQAs()
    newUsers.forEach(user => {
      const QAs: IQA[] = questions.map(question => ({
        question: question.question,
        answer: '',
        user: user.sheet,
      }))
      DBService.addQAs(QAs)
    })
    return `Respostas resetadas com sucesso. Novos usuários: ${newUsers.map(user => user.name).join(', ')}`
  }
}
