/* eslint-disable import/extensions */
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { UsersSheetCellsInfo, USERS_TAB_NAME } from '../../enums/UsersSheet'
import { Config } from '../../config'
import { IUser } from '../../models/IUser'

interface IProps {
  clientEmail: string
  privateKey: string
}

class UserSheet {
  clientEmail: string
  privateKey: string
  doc: GoogleSpreadsheet | undefined
  public users: IUser[] = []
  public initialized = false

  constructor(props: IProps) {
    if (!(props.clientEmail && props.privateKey)) throw new Error('Mandatory fields are empty 2')
    this.clientEmail = props.clientEmail
    this.privateKey = props.privateKey
  }

  async init(users: IUser[] = []) {
    this.doc = new GoogleSpreadsheet(Config.usersSheet)

    await this.doc.useServiceAccountAuth({
      client_email: this.clientEmail,
      private_key: this.privateKey,
    })
    this.initialized = true

    await this.doc.loadInfo()
    this.users = users
    await this.loadUsers()
  }

  async loadUsers() {
    if (!this.doc) {
      await this.init()
    }
    if (!this.doc) {
      throw new Error()
    }

    const sheet = this.doc.sheetsByTitle[USERS_TAB_NAME]
    const rowNumber = sheet.rowCount
    await sheet.loadCells(`${UsersSheetCellsInfo.INTERVAL}${rowNumber}`)
    this.users = []
    for (let i = 1; i <= rowNumber; i += 1) {
      this.users.push({
        sheet: sheet.getCellByA1(`${UsersSheetCellsInfo.SHEET_COLUMN}${i}`).formattedValue,
        name: sheet.getCellByA1(`${UsersSheetCellsInfo.NAME_COLUMN}${i}`).formattedValue,
      })
    }
    return this.users
  }
}

export default UserSheet
