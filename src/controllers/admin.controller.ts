import { Response, Request } from 'express'
import { AdminService } from '../services/admin.service'

export async function refreshUsersController(req: Request, res: Response) {
  try {
    res.send(await AdminService.refreshUsers())
  } catch (e: any) {
    res.status(500).send(e.message)
  }
}

export async function getUserController(req: Request, res: Response) {
  try {
    res.send(await AdminService.getUsers())
  } catch (e: any) {
    res.status(500).send(e.message)
  }
}
