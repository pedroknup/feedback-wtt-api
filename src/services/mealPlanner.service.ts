/* eslint-disable import/extensions */
import { DBService } from './db.service'
import { calculateDayMacros } from '../utils/calculateDayMacros'
// import credentials from '../credentials.json'
import ConnectionManager from './managers/connection.manager'
import { Config } from '../config'
import { IFood } from 'src/models/IFood'

export class MealPlannerService {
  public static baseURL = '/planner'

  private static connectionManager = new ConnectionManager({
    clientEmail: Config.clientEmail,
    privateKey: Config.privateKey,
  })

  static async getUserWeekPlan(user: string) {
    let weekPlan = await DBService.getUserWeekPlan(user)
    if (!weekPlan) {
      const refreshedData = await MealPlannerService.refreshUserRelatedData(user)
      weekPlan = refreshedData.weekPlan
    }

    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

    weekDays.forEach(day => {
      const generateRandomHexadecimal12DigitsLong = () => {
        return Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14)
      }
      weekPlan[day] = {
        meals: weekPlan[day].map((meal: any) => {
          const toReturn = { ...meal, id: generateRandomHexadecimal12DigitsLong() }
          delete toReturn._id
          return toReturn
        }),
        ...calculateDayMacros(weekPlan[day]),
      }
    })
    return weekPlan
  }

  static async getUserMeta(user: string) {
    return await DBService.getMetaByUser(user)
  }

  static async getUserFoods(user: string, updated: boolean = false) {
    if (updated) {
      await DBService.deleteFoodsByUser(user)
      const updatedFoods = await MealPlannerService.connectionManager.fetchFoods(user)
      await DBService.addFoods(updatedFoods)
      return updatedFoods
    }
    return await DBService.getFoodsByUser(user)
  }

  static async writeFood(user: string, name: string, calories: number, proteins: number, carbs: number, fat: number) {
    const food = await DBService.getFoodByName(user, name)
    if (food) throw new Error('Food already exists')

    const foodToWrite: IFood = {
      user,
      name,
      calories,
      proteins,
      carbs,
      notes: '',
      quantity: 1,
      fat,
    }

    await MealPlannerService.connectionManager.writeFood(user, foodToWrite)
    await DBService.addFoods([foodToWrite])

    return true
  }

  static async refreshUserRelatedData(user: string) {
    await DBService.deleteAllUserData(user)

    const foods = await MealPlannerService.connectionManager.fetchFoods(user)

    const [weekPlan, meta] = await Promise.all([
      MealPlannerService.connectionManager.fetchWeekPlan(user),
      MealPlannerService.connectionManager.fetchMeta(user),
    ])

    await Promise.all([DBService.addFoods(foods), DBService.addWeekPlan(weekPlan), DBService.addMeta(meta)])

    return {
      foods: foods.length,
      weekPlan,
      meta: meta,
    }
  }
}
