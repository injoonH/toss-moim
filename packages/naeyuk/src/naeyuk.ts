import * as cheerio from 'cheerio'
import { isValid, parse } from 'date-fns'
import { z } from 'zod'

import { Path, TOSS_VERIFY_DOCUMENT_URL } from './const'
import { ResponseType, RowData } from './types'

const TABLE_PATH = 'thead + tbody'

function isDateValid(date: string) {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
  return datePattern.test(date) && isValid(parsedDate)
}

function formatNumber(value: string) {
  return Number(value.replace(/,/g, ''))
}

const dataSchema = z
  .object({
    datetime: z.string(),
    remarks: z.string(),
    transactionAmount: z.string(),
    balance: z.string(),
    notes: z.string(),
  })
  .transform((data) => ({
    ...data,
    transactionAmount: formatNumber(data.transactionAmount),
    balance: formatNumber(data.balance),
  }))
  .pipe(
    z.object({
      datetime: z.string(),
      remarks: z.string(),
      transactionAmount: z.number(),
      balance: z.number(),
      notes: z.string(),
    }),
  )

export async function getTableData(
  date: string,
  serial: string,
): Promise<ResponseType> {
  if (!isDateValid(date)) {
    return {
      ok: false,
      data: {
        message: '올바르지 않은 날짜입니다.',
      },
    }
  }

  const response = await fetch(`${TOSS_VERIFY_DOCUMENT_URL}/${date}/${serial}`)

  if (!response.ok) {
    return {
      ok: false,
      data: {
        message: (await response.json()).message,
      },
    }
  }

  const $table = cheerio.load(await response.text(), {
    xml: true,
  })

  const result: RowData = {}
  Array($table(`${TABLE_PATH}>tr`).length)
    .fill(null)
    .map((_, index) => {
      const $data = $table(`${TABLE_PATH}>tr:nth-child(${index + 1})`)
      const data = Path.reduce((acc, item) => {
        return {
          ...acc,
          [item.name]: $data.find(item.path).text(),
        }
      }, {})
      const parsed = dataSchema.safeParse(data)
      if (parsed.success) {
        result[index] = parsed.data
      }
    })

  return {
    ok: response.ok,
    data: result,
  }
}
