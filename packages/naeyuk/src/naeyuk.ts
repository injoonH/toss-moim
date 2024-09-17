import * as cheerio from 'cheerio'
import { z } from 'zod'

import { Path, TOSS_VERIFY_DOCUMENT_URL } from './const'
import type { ResponseType, RowData } from './types'

const TABLE_PATH = 'thead + tbody'

/**
 * Format date to 'yyyy-MM-dd' format
 */
function formatDate(date: Date) {
  return date.toLocaleDateString('en-CA')
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
  date: Date,
  serial: string,
): Promise<ResponseType> {
  const dateStr = formatDate(date)
  const res = await fetch(`${TOSS_VERIFY_DOCUMENT_URL}/${dateStr}/${serial}`)

  if (!res.ok) {
    return {
      ok: false as const,
      data: await res.json(),
    }
  }

  const $table = cheerio.load(await res.text(), {
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
    ok: res.ok,
    data: result,
  }
}
