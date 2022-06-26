/* eslint-disable import/extensions */
import { IFood } from '../../models/IFood'
import { IDietDays } from '../../models/IDietDays'
import { IMeta } from '../../models/IMeta'
import { isFoodValid } from '../../utils/foodValidator'
import { IWeekPlan } from '../../models/IWeekPlan'
import SheetBase from './sheet.base'
import { IDayPlan } from '../../models/IDayPlan'
import {
  FOOD_TAB_NAME,
  META_TAB_NAME,
  PlannerTabsNames,
  FoodsSheetCellsInfo,
  MetaSheetCellsInfo,
  WeekPlanSheetCellsInfo,
} from '../../enums/PlannerSheet'

class PlannerSheet extends SheetBase {
  foods: IFood[] = []
  meta: IMeta | null = null
  isFetchingFoods = false

  public async fetchWeekPlan(): Promise<IWeekPlan> {
    const mondayPlan = this._fetchMealsByDay('monday')
    const tuesdayPlan = this._fetchMealsByDay('tuesday')
    const wednesdayPlan = this._fetchMealsByDay('wednesday')
    const thursdayPlan = this._fetchMealsByDay('thursday')
    const fridayPlan = this._fetchMealsByDay('friday')
    const saturdayPlan = this._fetchMealsByDay('saturday')
    const sundayPlan = this._fetchMealsByDay('sunday')

    const [monday, tuesday, wednesday, thursday, friday, saturday, sunday] = await Promise.all([
      mondayPlan,
      tuesdayPlan,
      wednesdayPlan,
      thursdayPlan,
      fridayPlan,
      saturdayPlan,
      sundayPlan,
    ])

    return {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      user: this.spreadSheetId,
    }
  }

  public async fetchFoods() {
    if (!this.doc) throw new Error('No document found')

    this.isFetchingFoods = true

    const sheet = this.doc.sheetsByTitle[FOOD_TAB_NAME]
    const rowNumber = sheet.rowCount
    await sheet.loadCells(`${FoodsSheetCellsInfo.INTERVAL}${rowNumber}`)
    this.foods = []
    for (let i = 2; i <= rowNumber; i += 1) {
      const name = sheet.getCellByA1(`${FoodsSheetCellsInfo.NAME_COLUMN}${i}`).formattedValue
      const calories = parseInt(sheet.getCellByA1(`${FoodsSheetCellsInfo.CALORIES_COLUMN}${i}`).formattedValue)
      const proteins = parseInt(sheet.getCellByA1(`${FoodsSheetCellsInfo.PROTEINS_COLUMN}${i}`).formattedValue)
      const carbs = parseInt(sheet.getCellByA1(`${FoodsSheetCellsInfo.CARBS_COLUMN}${i}`).formattedValue)
      const fat = parseInt(sheet.getCellByA1(`${FoodsSheetCellsInfo.FAT_COLUMN}${i}`).formattedValue)
      const notes = sheet.getCellByA1(`${FoodsSheetCellsInfo.NOTES_COLUMN}${i}`).formattedValue
      this.foods.push({
        name,
        calories,
        proteins,
        carbs,
        fat,
        notes,
        quantity: 1,
        user: this.spreadSheetId,
      })
    }
    this.isFetchingFoods = false
    return this.foods
  }

  private async _fetchMealsByDay(day: keyof IDietDays): Promise<IDayPlan[]> {
    if (!this.doc) throw new Error('No document found')

    const normalizedDay = PlannerTabsNames[day]
    const sheet = this.doc.sheetsByTitle[normalizedDay]
    const rowNumber = sheet.rowCount
    await sheet.loadCells(`${WeekPlanSheetCellsInfo.INTERVAL}${rowNumber}`)

    if (this.foods === null) await this.fetchFoods()

    const dayPlan: IDayPlan[] = []
    let currentMeal = ''
    for (let i = 4; i <= rowNumber; i += 1) {
      const foodName = sheet.getCellByA1(`${WeekPlanSheetCellsInfo.FOOD_NAME_COLUMN}${i}`).formattedValue
      const food = this.foods.find(food => food.name === foodName)
      if (foodName) {
        if (!food || (foodName.charAt(0) === '[' && foodName.charAt(foodName.length - 1) === ']')) {
          currentMeal = foodName.substring(1, foodName.length - 1)
        } else {
          if (isFoodValid(food) && food) {
            const quantityString = sheet.getCellByA1(`${WeekPlanSheetCellsInfo.QUANTITY_COLUMN}${i}`)
              .formattedValue as string
            const quantity = quantityString ? parseFloat(quantityString) : 1
            dayPlan.push({
              ...food,
              quantity: quantity,
              meal: currentMeal,
              day: day,
            })
          }
        }
      }
    }

    return dayPlan
  }

  public async fetchMeta(): Promise<IMeta> {
    const sheet = this.doc?.sheetsByTitle[META_TAB_NAME]
    await sheet?.loadCells(MetaSheetCellsInfo.INTERVAL)
    const calories = parseInt(sheet?.getCellByA1(MetaSheetCellsInfo.CALORIES).formattedValue)
    const proteins = parseInt(sheet?.getCellByA1(MetaSheetCellsInfo.PROTEINS).formattedValue)
    const carbs = parseInt(sheet?.getCellByA1(MetaSheetCellsInfo.CARBS).formattedValue)
    const fat = parseInt(sheet?.getCellByA1(MetaSheetCellsInfo.FAT).formattedValue)
    return {
      calories,
      proteins,
      carbs,
      fat,
      user: this.spreadSheetId,
      createdAt: new Date(),
    }
  }

  async fetchAll() {
    await this.fetchFoods()
    await Promise.all([this.fetchMeta(), this.fetchWeekPlan()])
  }

  async writeFood(food: IFood) {
    if (!this.doc) throw new Error('No document found')

    const sheet = this.doc.sheetsByTitle[FOOD_TAB_NAME]
    await sheet.addRow([food.name, food.calories, food.proteins, food.carbs, food.carbs])
  }
}

export default PlannerSheet
