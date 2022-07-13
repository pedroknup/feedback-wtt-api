/* eslint-disable import/extensions */

import { GoogleSpreadsheet } from 'google-spreadsheet'
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

export interface ISheetBaseProps {
  clientEmail: string
  privateKey: string
  spreadSheetId: string
  tabName: string
}

class SheetBase {
  spreadSheetId: string
  privateKey: string
  clientEmail: string
  doc: GoogleSpreadsheet | undefined
  sheet: GoogleSpreadsheetWorksheet | null = null
  tabName: string = ''
  tabs: string[] = []
  rows: string[][] = []
  rowCount: number = 0
  columnCount: number = 0
  public initialized = false

  constructor(props: ISheetBaseProps) {
    if (!(props.clientEmail && props.privateKey && props.spreadSheetId && props.tabName))
      throw new Error('Mandatory fields are empty')
    this.clientEmail = props.clientEmail
    this.privateKey = props.privateKey
    this.spreadSheetId = props.spreadSheetId
    this.tabName = props.tabName
  }

  async init() {
    this.doc = await this._loadDoc()
    this.sheet = this.doc.sheetsByTitle[this.tabName]
  }

  async _loadRows() {
    if (!this.doc) {
      await this.init()
    }
    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized')

    this.rowCount = this.sheet.rowCount
    this.columnCount = this.sheet.columnCount
    const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lastColumn = alphabetLetters.charAt(this.columnCount - 1)
    await this.sheet.loadCells(`A${1}:${lastColumn}${this.rowCount}`)
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

  async loadRowsArray() {
    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized')
    await this._loadRows()

    this.rows = []
    for (let i = 0; i < this.rowCount; i += 1) {
      this.rows[i] = []
      for (let j = 0; j < this.columnCount; j += 1) {
        this.rows[i].push(this.sheet.getCell(i, j).formattedValue)
      }
    }

    return this.rows
  }
}

export default SheetBase
