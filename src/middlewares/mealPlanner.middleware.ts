import { NextFunction, Request, Response } from 'express'
import { DBService } from '../services/db.service'

async function userValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.headers.user || req.params.user) {
    const userParam = (req.headers.user || req.params.user) as string
    if (userParam) {
      const user = await DBService.getUser(userParam)
      if (user) {
        req.user = user
        next()
      } else {
        res.status(404).send('User not found')
      }
    } else {
      res.status(401).send('Unauthorized')
    }
  } else {
    res.status(401).send('Unauthorized')
  }
}

export { userValidatorMiddleware }
