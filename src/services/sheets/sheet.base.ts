/* eslint-disable import/extensions */

import { GoogleSpreadsheet } from 'google-spreadsheet'

export interface ISheetBaseProps {
  clientEmail: string
  privateKey: string
  spreadSheetId: string
}

class SheetBase {
  spreadSheetId: string
  privateKey: string
  clientEmail: string
  doc: GoogleSpreadsheet | undefined
  tabs: string[] = []
  public initialized = false

  constructor(props: ISheetBaseProps) {
    if (!(props.clientEmail && props.privateKey && props.spreadSheetId)) throw new Error('Mandatory fields are empty')
    this.clientEmail = props.clientEmail
    this.privateKey = props.privateKey
    this.spreadSheetId = props.spreadSheetId
  }

  async init() {
    this.doc = await this._loadDoc()
  }

  private async _loadDoc() {
    const doc = new GoogleSpreadsheet(this.spreadSheetId)

    await doc.useServiceAccountAuth({
      client_email: this.clientEmail,
      private_key: this.privateKey,
    })

    await doc.loadInfo()
    this.initialized = true
    return doc
  }
}

export default SheetBase
