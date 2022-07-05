import { ObjectId } from "mongodb";

export interface IQA {
  question: string, 
  answer?: string,
  _id?: ObjectId,
  user: string
}
