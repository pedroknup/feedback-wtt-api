// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express'
import { userValidatorMiddleware } from '../middlewares/mealPlanner.middleware'
import { getUserQAController, refreshUserRelatedDataController, writeUserAnswersController } from '../controllers/qa.controller'
const qaRouter = express.Router()

qaRouter.get('/refresh/:user', userValidatorMiddleware, refreshUserRelatedDataController)
qaRouter.get('/', userValidatorMiddleware, getUserQAController)
qaRouter.post('/', userValidatorMiddleware, writeUserAnswersController)

export default qaRouter
