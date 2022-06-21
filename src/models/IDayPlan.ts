// eslint-disable-next-line import/extensions
import { IFood } from './IFood'

export interface IDayPlan extends IFood {
  meal: string,
  day: string
}

export interface IDayPlanDocument extends IDayPlan, Document {}
