/* eslint-disable import/extensions */
import SheetBase from './sheet.base'
import { IQA } from '../../models/IQA'

class QASheet extends SheetBase {
  questionsAndAnswers: IQA[] = []
  userColumnIndex: number = -1

  async init(QAs?: IQA[]): Promise<void> {
    await super.init()

    if (QAs) {
      this.questionsAndAnswers = QAs
    }
  }

  private _getUserColumnIndex(userId: string): number {
    const userColumn = this.rows[1].findIndex(row => row === userId)
    if (userColumn === -1) throw new Error('User not found')
    return userColumn
  }

  public async fetchQuestions(): Promise<IQA[]> {
    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized')

    await this._loadRows()
    await this.loadRowsArray()

    this.questionsAndAnswers = this.rows.slice(2).map(row => {
      return {
        question: row[0],
        answer: '',
        user: '',
      }
    })
    return this.questionsAndAnswers
  }

  public async fetchQAs(userId: string): Promise<IQA[]> {
    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized')

    await this._loadRows()
    await this.loadRowsArray()

    const userColumn = this._getUserColumnIndex(userId)
    const QAs = this.rows.slice(2).map(row => {
      return {
        question: row[0],
        answer: row[userColumn],
        user: userId,
      }
    })
    return QAs
  }

  public async writeAnswersByUser(answers: string[], userId: string): Promise<IQA[]> {
    await this.loadRowsArray()

    if (!this.doc || !this.sheet) throw new Error('Document or sheet not initialized')

    if (answers.length !== this.rowCount - 2)
      throw new Error(
        'Number of answers does not match number of questions' + answers.length + ' ' + this.rowCount + ' ' + userId,
      )

    const userColumn = this._getUserColumnIndex(userId)
    const QAs = []
    for (let i = 2; i < this.rowCount; i += 1) {
      const answer = answers[i - 2]
      const cell = this.sheet.getCell(i, userColumn)
      cell.value = answer
      QAs.push({
        question: this.rows[i][0],
        answer: answer,
        user: userId,
      })
    }

    await this.sheet.saveUpdatedCells()
    return QAs
  }
}

export default QASheet
