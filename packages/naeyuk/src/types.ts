export type RowData = Record<
  number,
  {
    datetime: string
    remarks: string
    transactionAmount: number
    balance: number
    notes: string
  }
>

export type TossVerifyError = {
  code: string
  message: string
  debugMessage: string
  errorLevel: string
}

export type ResponseType =
  | {
      ok: true
      data: RowData
    }
  | {
      ok: false
      data: TossVerifyError
    }
