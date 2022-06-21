import { Db, MongoClient } from 'mongodb'
import chalk from 'chalk'

const herokuMongoURL: string = process.env.DB_URI || ''

const dbName = process.env.DB_NAME

export class DBServiceBase {
  private static _db: Db | null

  static get db() {
    return async () => {
      if (!DBServiceBase._db) {
        DBServiceBase._db = await DBServiceBase._connectDB()
      }
      return DBServiceBase._db
    }
  }

  private static async _connectDB(): Promise<Db> {
    if (!herokuMongoURL) {
      throw new Error('Missing DB_URI environment variable')
    }
    console.log('Connecting to remote DB', dbName)
    return new Promise((resolve, reject) => {
      MongoClient.connect(herokuMongoURL, (err, client) => {
        if (err || !client) {
          reject(err)
          return console.log(err)
        }
        console.log(chalk.greenBright(`Connected MongoDB: ${herokuMongoURL}`))
        resolve(client.db(dbName))
      })
    })
  }
}
