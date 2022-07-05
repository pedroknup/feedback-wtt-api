import { IUser } from 'src/models/IUser'
import { DBServiceBase } from './db.base.service'
import { IQA } from 'src/models/IQA'

export class DBService extends DBServiceBase {
  public static async addUsers(users: IUser[]) {
    const db = await DBService.db()
    return db.collection('users').insertMany(users)
  }

  public static async getAllQAs() {
    const db = await DBService.db()
    return db.collection('qa').find({}).toArray() as unknown as IQA[]
  }

  public static async addQAs(qas: IQA[]) {
    const db = await DBService.db()
    return db.collection('qa').insertMany(qas)
  }

  public static async updateQAs(qas: IQA[]) {
    const db = await DBService.db()
    qas.forEach(async qa => {
      await db.collection('qa').updateOne({ _id: qa._id }, { $set: qa }, { upsert: true })
    })
  }

  public static async getUser(user: string) {
    const db = await DBService.db()

    return (await db.collection('users').findOne({ sheet: user })) as unknown as IUser
  }

  public static async getQAByUser(user: string) {
    const db = await DBService.db()

    return db.collection('qa').find({ user }).toArray() as unknown as IQA[]
  }

  public static async getAllUsers() {
    const db = await DBService.db()

    return db.collection('users').find({}).toArray() as unknown as IUser[]
  }

  public static async deleteQAByUser(user: string) {
    const db = await DBService.db()

    return await db.collection('qa').deleteMany({ user })
  }
  public static async deleteAllUsers() {
    const db = await DBService.db()

    return await db.collection('users').deleteMany({})
  }
}
