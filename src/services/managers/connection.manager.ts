/* eslint-disable import/extensions */

import { IQA } from 'src/models/IQA';
import QASheet from '../sheets/qa.sheet';

interface IConnections {
  [key: string]: {
    lastUsedAt: Date | undefined
    manager: QASheet
  }
}

interface IProps {
  clientEmail: string
  privateKey: string
  initialQAs: IQA[]
}

interface IUser {
  id: string
  name: string
}

class ConnectionManager {
  private _clientEmail: string
  private _privateKey: string
  private _initialQAs: IQA[] = []
  public connections: IConnections = {}
  public users: IUser[] = []

  constructor(props: IProps) {
    if (!(props.clientEmail && props.privateKey)) throw new Error('Mandatory fields are empty')
    this._clientEmail = props.clientEmail
    this._privateKey = props.privateKey
    this._initialQAs = props.initialQAs;
  }

  async init(userId: string): Promise<void> {
    this.connections[userId] = {
      lastUsedAt: new Date(),
      manager: new QASheet({
        clientEmail: this._clientEmail,
        privateKey: this._privateKey,
        spreadSheetId: userId,
      }),
    }
    console.log('Initialized Spreadsheet module for', userId)
    console.log('Active connections: ', Object.keys(this.connections).length)
    const userQAs = this._initialQAs.filter(qa => qa.user === userId)
    await this.connections[userId].manager.init(userQAs)
  }

  async fetchQA(userId: string): Promise<IQA[]> {
    if (!this.connections[userId]) {
      this.init(userId)
    }
    return await this.connections[userId].manager.fetchQAs()
  }

  async writeAnswers(userId: string, answers: string[]): Promise<IQA[]> {
    if (!this.connections[userId]) {
      this.init(userId)
    }
  
    return await this.connections[userId].manager.writeAnswers(answers)
  }
}

export default ConnectionManager
