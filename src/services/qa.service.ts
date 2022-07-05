/* eslint-disable import/extensions */
import { DBService } from './db.service'
import ConnectionManager from './managers/connection.manager'
import { Config } from '../config'

export class QAService {
  public static baseURL = '/qa'

  private static connectionManager : ConnectionManager;

  static async initConnection() {
    const allQA = await DBService.getAllQAs();
    this.connectionManager = new ConnectionManager({
      clientEmail: Config.clientEmail,
      privateKey: Config.privateKey,
      initialQAs: allQA,
    })
  }

  static async getUserQA(user: string) {
    if (!this.connectionManager) {
      await this.initConnection()
    }
    return await DBService.getQAByUser(user)
  }

  static async refreshUserRelatedData(user: string) {
    if (!this.connectionManager) {
      await this.initConnection()
    }
  
    await DBService.deleteQAByUser(user)

    const qa = await QAService.connectionManager.fetchQA(user)
    await DBService.addQAs(qa)

    return qa
  }

  static async writeUserAnswers(user: string, answers: string[]) {
    if (!this.connectionManager) {
      await this.initConnection()
    }

    const qa = await QAService.connectionManager.writeAnswers(user, answers)
    await DBService.updateQAs(qa)

    return await DBService.getQAByUser(user)
  }
}
