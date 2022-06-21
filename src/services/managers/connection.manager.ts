/* eslint-disable import/extensions */

import { IMeta } from '../../models/IMeta'
import { IFood } from '../../models/IFood'
import { IWeekPlan } from '../../models/IWeekPlan'
import PlannerSheet from '../sheets/planner.sheet'

interface IConnections {
  [key: string]: {
    lastUsedAt: Date | undefined
    manager: PlannerSheet
  }
}

interface IProps {
  clientEmail: string
  privateKey: string
}

interface IUser {
  id: string
  name: string
}

class ConnectionManager {
  private _clientEmail: string
  private _privateKey: string
  public connections: IConnections = {  }
  public users: IUser[] = []

  constructor(props: IProps) {
    if (!(props.clientEmail && props.privateKey)) throw new Error('Mandatory fields are empty')
    this._clientEmail = props.clientEmail
    this._privateKey = props.privateKey
  }

  async init(userId: string) {
    
    this.connections[userId] = {
      lastUsedAt: new Date(),
      manager: new PlannerSheet({
        clientEmail: this._clientEmail,
        privateKey: this._privateKey,
        spreadSheetId: userId,
      }),
    }
    console.log('Initialized Spreadsheet module for', userId)
    console.log('Active connections: ', Object.keys(this.connections).length)
    await this.connections[userId].manager.init()
  }

  private addUserPropsToObject(object: IMeta | IWeekPlan, userId: string) {
    return {
      ...object,
      user: userId,
    }
  }

  async fetchMeta(userId: string): Promise<IMeta> {
    if (!this.connections[userId]) {
      this.init(userId)
    }
    return await this.connections[userId].manager.fetchMeta()
  }

  async fetchWeekPlan(userId: string): Promise<IWeekPlan> {
    if (!this.connections[userId]) {
      this.init(userId)
    }
    return await this.connections[userId].manager.fetchWeekPlan()
  }

  async fetchFoods(userId: string): Promise<IFood[]> {
    if (!this.connections[userId]) {
      await this.init(userId)
    }
    return await this.connections[userId].manager.fetchFoods()
  }

  async fetchAll(userId: string) {
    if (!this.connections[userId]) {
      await this.init(userId)
    }
    await this.connections[userId].manager.fetchAll()
  }
}

export default ConnectionManager
