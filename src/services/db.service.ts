import { IUser } from 'src/models/IUser'
import { IWeekPlan } from 'src/models/IWeekPlan'
import { DBServiceBase } from './db.base.service'
import { IMeta } from 'src/models/IMeta'
import { IFood } from 'src/models/IFood'

export class DBService extends DBServiceBase {
  public static async addUsers(users: IUser[]) {
    const db = await DBService.db()
    return db.collection('users').insertMany(users)
  }

  public static async addFoods(foods: IFood[]) {
    const db = await DBService.db()
    return db.collection('foods').insertMany(foods)
  }

  public static async addMeta(meta: IMeta) {
    const db = await DBService.db()
    return db.collection('meta').insertOne(meta)
  }

  public static async addWeekPlan(weekPlan: IWeekPlan) {
    const db = await DBService.db()
    return db.collection('week-plan').insertOne(weekPlan)
  }

  public static async getUserWeekPlan(user: string) {
    const db = await DBService.db()

    return (await db.collection('week-plan').findOne({ user })) as unknown as IWeekPlan
  }

  public static async getUser(user: string) {
    const db = await DBService.db()

    return (await db.collection('users').findOne({ sheet: user })) as unknown as IUser
  }

  public static async getMetaByUser(user: string) {
    const db = await DBService.db()

    return (await db.collection('meta').findOne({ user })) as unknown as IMeta
  }

  public static async getFoodsByUser(user: string) {
    const db = await DBService.db()

    return db.collection('foods').find({user}).toArray() as unknown as IFood[]
  }

  public static async getFoodByName(user: string, name: string) {
    const db = await DBService.db()

    return db.collection('foods').findOne({user, name}) as unknown as IFood
  }

  public static async getAllUsers() {
    const db = await DBService.db()

    return db.collection('users').find({}).toArray() as unknown as IUser[]
  }

  public static async deleteWeekPlanByUser(user: string) {
    const db = await DBService.db()

    return await db.collection('week-plan').deleteMany({ user })
  }

  public static async deleteMetaByUser(user: string) {
    const db = await DBService.db()

    return await db.collection('meta').deleteMany({ user })
  }
  public static async deleteFoodsByUser(user: string) {
    const db = await DBService.db()

    return await db.collection('foods').deleteMany({ user })
  }
  public static async deleteAllUsers() {
    const db = await DBService.db()

    return await db.collection('users').deleteMany({})
  }
  public static async deleteAllUserData(user: string) {
    await Promise.all([DBService.deleteFoodsByUser(user), DBService.deleteMetaByUser(user), DBService.deleteWeekPlanByUser(user)])
  }
}
