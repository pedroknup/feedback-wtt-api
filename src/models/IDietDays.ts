import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

export interface IDietDays {
  monday: GoogleSpreadsheetWorksheet
  tuesday: GoogleSpreadsheetWorksheet
  wednesday: GoogleSpreadsheetWorksheet
  thursday: GoogleSpreadsheetWorksheet
  friday: GoogleSpreadsheetWorksheet
  saturday: GoogleSpreadsheetWorksheet
  sunday: GoogleSpreadsheetWorksheet
}