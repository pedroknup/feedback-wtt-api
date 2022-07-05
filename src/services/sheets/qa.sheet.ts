/* eslint-disable import/extensions */
import SheetBase from './sheet.base'
import { IQA } from '../../models/IQA'
import { QASheetCellsInfo, QA_TAB_NAME } from '../../enums/QASheet'
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'

class QASheet extends SheetBase {
  questionsAndAnswers: IQA[] = []
  sheet: GoogleSpreadsheetWorksheet | null = null
  rowCount: number = 0

  async init(QAs: IQA[]): Promise<void> {
    super.init()

    if (QAs) {
      this.questionsAndAnswers = QAs;
    }
  }

  private async _loadRows() {
    if (!this.doc) {
      await super.init()
    }
    if (!this.doc){
      throw new Error('Document not initialized')
    }

    this.sheet = this.doc.sheetsByTitle[QA_TAB_NAME]
    this.rowCount = this.sheet.rowCount
    await this.sheet.loadCells(`${QASheetCellsInfo.INTERVAL}${this.rowCount}`)
  }

  public async fetchQAs(): Promise<IQA[]> {
    await this._loadRows()

    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized')

    console.log('fetching')
    this.questionsAndAnswers = []
    for (let i = 2; i <= this.rowCount; i += 1) {
      const question = this.sheet.getCellByA1(`${QASheetCellsInfo.QUESTION_COLUMN}${i}`).formattedValue
      if (question)
        this.questionsAndAnswers.push({
          question,
          user: this.spreadSheetId,
        })
    }

    return this.questionsAndAnswers
  }

  public async writeAnswers(answers: string[]): Promise<IQA[]> {
    await this._loadRows()

    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized')

    if (answers.length !== this.rowCount - 1) throw new Error('Number of answers does not match number of questions' + answers.length + ' ' + this.rowCount)

    for (let i = 1; i < this.rowCount; i += 1) {
      const answer = answers[i - 1]
      this.questionsAndAnswers[i - 1].answer = answer
      const cell = this.sheet.getCell(i, 1)
      cell.value = answer
    }

    await this.sheet.saveUpdatedCells()
    return this.questionsAndAnswers
  }
}

export default QASheet
