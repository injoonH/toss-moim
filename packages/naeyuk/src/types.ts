import { Column } from './const'

export type RowData = {
  [idx: number]: {
    [Column.DATETIME]: string
    [Column.REMARKS]: string
    [Column.TRANSACTION_AMOUNT]: number
    [Column.BALANCE]: number
    [Column.NOTES]: string
  }
}

export type ResponseType =
  | {
      ok: true
      data: RowData
    }
  | {
      ok: false
      data: {
        message: string
      }
    }
