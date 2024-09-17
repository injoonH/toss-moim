export const TOSS_VERIFY_DOCUMENT_URL =
  'https://api.tossbank.com/api-public/document/view'

export const Column = {
  DATETIME: 'datetime',
  REMARKS: 'remarks',
  TRANSACTION_AMOUNT: 'transactionAmount',
  BALANCE: 'balance',
  NOTES: 'notes',
} as const

export const Path = [
  { name: Column.DATETIME, path: 'td:nth-child(1)' },
  { name: Column.REMARKS, path: 'td:nth-child(2)' },
  {
    name: Column.TRANSACTION_AMOUNT,
    path: 'td:nth-child(3)',
  },
  { name: Column.BALANCE, path: 'td:nth-child(4)' },
  { name: Column.NOTES, path: 'td:nth-child(5)' },
]
