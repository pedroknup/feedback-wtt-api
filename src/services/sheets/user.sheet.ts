/* eslint-disable import/extensions */
// import { UsersSheetCellsInfo, USERS_TAB_NAME } from '../../enums/UsersSheet'
import { IUser } from '../../models/IUser'
import SheetBase from './sheet.base'

class UserSheet extends SheetBase {
  public users: IUser[] = []
  public initialized = false

  async init(users: IUser[] = []): Promise<void> {
    await super.init()

    if (users) {
      this.users = users
    }
  }

  async loadUsers() {
    if (!this.doc || !this.sheet) {
      await this.init()
    }
    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized3')
    await this.loadRowsArray()

    this.users = this.rows.map(row => {
      return {
        name: row[0],
        sheet: row[1],
      }
    })
    return this.users
  }
}

export default UserSheet
