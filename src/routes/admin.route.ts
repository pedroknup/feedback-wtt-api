// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { getUserMeta, getUserWeekPlan, refreshUserRelatedData } from 'src/controllers/mealPlanner.controller'
import express from 'express'
import { refreshUsersController, getUserController } from '../controllers/admin.controller'

const adminRouter = express.Router()
adminRouter.get('/refresh', refreshUsersController)
adminRouter.get('/users', getUserController)

export default adminRouter
