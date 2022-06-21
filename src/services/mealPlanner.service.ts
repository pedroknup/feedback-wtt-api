/* eslint-disable import/extensions */
import { DBService } from './db.service'
import { calculateDayMacros } from '../utils/calculateDayMacros'
import credentials from '../credentials.json'
import ConnectionManager from './managers/connection.manager';

export class MealPlannerService {
  public static baseURL = '/planner'

  private static connectionManager = new ConnectionManager({
    clientEmail: credentials.client_email,
    privateKey: credentials.private_key,
  })

  static async getUserWeekPlan(user: string) {
    const weekPlan = await DBService.getUserWeekPlan(user)
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

  static async getUserFoods(user: string) {
    return await DBService.getFoodsByUser(user)
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
      meta: meta,
    }
  }
}
