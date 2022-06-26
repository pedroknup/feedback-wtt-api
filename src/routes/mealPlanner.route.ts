// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { getUserMeta, getUserWeekPlan, refreshUserRelatedData } from 'src/controllers/mealPlanner.controller'
import express from 'express'
import { userValidatorMiddleware } from '../middlewares/mealPlanner.middleware'
import {
  getUserFoodsController,
  getUserMetaController,
  getUserWeekPlanController,
  refreshUserRelatedDataController,
  writeFoodController,
} from '../controllers/mealPlanner.controller'
const mealPlannerRouter = express.Router()

mealPlannerRouter.get('/refresh/:user', userValidatorMiddleware, refreshUserRelatedDataController)
mealPlannerRouter.get('/week-plan', userValidatorMiddleware, getUserWeekPlanController)
mealPlannerRouter.get('/meta', userValidatorMiddleware, getUserMetaController)
mealPlannerRouter.get('/foods', userValidatorMiddleware, getUserFoodsController)
mealPlannerRouter.post('/food', userValidatorMiddleware, writeFoodController)

export default mealPlannerRouter
