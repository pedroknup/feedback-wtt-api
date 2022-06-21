import { NextFunction } from 'express'

async function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  console.log(`${req.method} ${req.url}`)
  next()
  const ms = Date.now() - start
  console.log(`${req.method} ${req.url} ${ms}ms`)
}

module.exports = {
  loggingMiddleware,
}
