/* eslint-disable import/extensions */

import { IDayPlan } from '../models/IDayPlan'

const calculateDayMacros = (dayPlan: IDayPlan[]) => {
  const calories = dayPlan.reduce((acc, meal) => {
    const mealCalories = meal !== undefined ? meal.calories * meal.quantity : 0
    return acc + mealCalories
  }, 0)

  const proteins = dayPlan.reduce((acc, meal) => {
    const mealProtein = meal !== undefined ? meal.proteins * meal.quantity : 0
    return acc + mealProtein
  }, 0)

  const carbs = dayPlan.reduce((acc, meal) => {
    const mealCarbs = meal !== undefined ? meal.carbs * meal.quantity : 0
    return acc + mealCarbs
  }, 0)

  const fat = dayPlan.reduce((acc, meal) => {
    const mealFat = meal !== undefined ? meal.fat * meal.quantity : 0
    return acc + mealFat
  }, 0)

  return {
    calories,
    proteins,
    carbs,
    fat,
  }
}

export { calculateDayMacros }
