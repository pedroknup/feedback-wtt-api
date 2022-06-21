import { Response, Request } from 'express'
import { MealPlannerService } from '../services/mealPlanner.service'

export async function refreshUserRelatedDataController(req: Request, res: Response) {
  try {
    res.send(await MealPlannerService.refreshUserRelatedData(req.user.sheet))
  } catch (e: any) {
    res.status(500).send(e.message)
  }
}

export async function getUserWeekPlanController(req: Request, res: Response) {
  try {
    res.send(await MealPlannerService.getUserWeekPlan(req.user.sheet))
  } catch (e: any) {
    res.status(500).send(e.message)
  }
}

export async function getUserMetaController(req: Request, res: Response) {
  try {
    const meta = await MealPlannerService.getUserMeta(req.user.sheet)
    res.send({
      ...meta, 
      user: req.user
    })
  } catch (e: any) {
    res.status(500).send(e.message)
  }
}

export async function getUserFoodsController(req: Request, res: Response) {
  try {
    res.send(await MealPlannerService.getUserFoods(req.user.sheet))
  } catch (e) {
    res.status(500).send()
  }
}
