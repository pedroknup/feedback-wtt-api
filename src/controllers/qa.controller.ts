import { Response, Request } from 'express'
import { QAService } from '../services/qa.service';

export async function refreshUserRelatedDataController(req: Request, res: Response) {
  try {
    res.send(await QAService.refreshUserRelatedData(req.user.sheet))
  } catch (e: any) {
    res.status(500).send(e.message)
  }
}

export async function getUserQAController(req: Request, res: Response) {
  try {
    const QA = await QAService.getUserQA(req.user.sheet)

    res.send({
      QA,
      user: req.user
    })
  } catch (e: any) {
    res.status(500).send(e.message)
  }
}

export async function writeUserAnswersController(req: Request, res: Response){
  try {
    if (!req.body.answers) {
      return res.status(400).send('No answers provided')
    }
    const updatedQAs =  await QAService.writeUserAnswers(req.user.sheet, req.body.answers)
    res.send(updatedQAs)
  } catch (e: any) {
    res.status(500).send(e.message)
  }

  return;
}


// export async function writeAnswerController(req: Request, res: Response) {
  // try {
  //   const { name, calories, proteins, carbs, fat } = req.body
  //   if (!name || !calories || !proteins || !carbs || !fat) {
  //     res.status(400).send('Missing required fields')
  //     return
  //   }

  //   res.send(await MealPlannerService.writeFood(req.user.sheet, name, calories, proteins, carbs, fat ))
  // } catch (e: any) {
  //   res.status(500).send(e.message)
  // }
// }

