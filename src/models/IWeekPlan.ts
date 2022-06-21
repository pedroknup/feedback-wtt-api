/* eslint-disable import/extensions */
import { Document } from 'mongodb';
import { IDayPlan } from './IDayPlan';

export interface IWeekPlan extends Document {
  monday: IDayPlan[]
  tuesday: IDayPlan[]
  wednesday: IDayPlan[]
  thursday: IDayPlan[]
  friday: IDayPlan[]
  saturday: IDayPlan[]
  sunday: IDayPlan[]
  user: string,
}
