/* eslint-disable import/extensions */

import { IQA } from 'src/models/IQA'
import QASheet from '../sheets/qa.sheet'
import UserSheet from '../sheets/user.sheet'

interface IProps {
  clientEmail: string
  privateKey: string
  spreadSheet: string
  initialQAs: IQA[]
  tabName: string
}

interface IUser {
  id: string
  name: string
}

class ConnectionManager {
  private _clientEmail: string
  private _privateKey: string
  private _spreadSheet: string
  private _initialQAs: IQA[] = []
  public UserSheet: UserSheet | null = null
  public QASheet: QASheet | null = null
  public users: IUser[] = []

  constructor(props: IProps) {
    if (!(props.clientEmail && props.privateKey)) throw new Error('Mandatory fields are empty')
    this._clientEmail = props.clientEmail
    this._privateKey = props.privateKey
    this._spreadSheet = props.spreadSheet
    this._initialQAs = props.initialQAs
  }

  async init(): Promise<void> {
    this.QASheet = new QASheet({
      clientEmail: this._clientEmail,
      privateKey: this._privateKey,
      spreadSheetId: this._spreadSheet,
      tabName: 'feedback',
    })

    await this.QASheet.init()

    console.log('Initialized Spreadsheet module')
  }

  async fetchQAByUser(userId: string): Promise<IQA[]> {
    if (!this.QASheet) {
      await this.init()
    }
    if (!this.QASheet) throw new Error('Not initiated')

    return await this.QASheet.fetchQAs(userId)
  }

  async fetchQuestions(): Promise<IQA[]> {
    if (!this.QASheet) {
      await this.init()
    }
    if (!this.QASheet) throw new Error('Not initiated')

    return await this.QASheet.fetchQuestions()
  }

  async writeAnswers(userId: string, answers: string[]): Promise<IQA[]> {
    if (!this.QASheet) {
      await this.init()
    }
    if (!this.QASheet) throw new Error('Not initiated')

    return await this.QASheet.writeAnswersByUser(answers, userId)
  }
}

export default ConnectionManager
