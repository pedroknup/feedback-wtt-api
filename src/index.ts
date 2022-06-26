#!/usr/bin/env node
/* eslint-disable import/extensions */
/* eslint-disable no-console */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mealPlannerRouter from './routes/mealPlanner.route'
import { MealPlannerService } from './services/mealPlanner.service'
import { AdminService } from './services/admin.service'
import adminRouter from './routes/admin.route'
import { DBService } from './services/db.service'

const app = express()
const processPort = process.env.PORT || ''
const port = parseInt(processPort) || 8080

app.use(express.json())

app.get('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
app.use(cors(), function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/health', (req, res) => {
  res.send('OK')
})

app.use(MealPlannerService.baseURL, mealPlannerRouter)
app.use(AdminService.baseURL, adminRouter)

app.listen(port, async () => {
  console.log(`server started at http://localhost:${port}`)
  await DBService.db()
})
