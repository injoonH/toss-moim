import assert from 'assert'
import * as cheerio from 'cheerio'

import { TOSS_VERIFY_DOCUMENT_URL } from './const'
import type { ResponseType } from './types'

/**
 * Format date to 'yyyy-MM-dd' format
 */
function formatDate(date: Date) {
  return date.toLocaleDateString('en-CA')
}

function formatNumber(value: string) {
  return Number(value.replace(/,/g, ''))
}

export async function getTableData(
  date: Date,
  serial: string,
): Promise<ResponseType> {
  const dateStr = formatDate(date)
  const res = await fetch(`${TOSS_VERIFY_DOCUMENT_URL}/${dateStr}/${serial}`)

  if (!res.ok)
    return {
      ok: false,
      data: await res.json(),
    }

  const $ = cheerio.load(await res.text(), { xml: true })
  const $rows = $('thead + tbody > tr').toArray()

  // 각 행의 자식 태그의 텍스트만 추출
  const data = $rows.map((row) => {
    const texts = row.children
      .map(
        (node) =>
          node.type === 'tag' &&
          node.firstChild?.type === 'text' &&
          node.firstChild.data,
      )
      .filter((node): node is string => !!node)

    assert(texts.length === 5, `열 개수가 맞지 않아요: ${texts}`)

    return {
      datetime: texts[0]!!,
      remarks: texts[1]!!,
      transactionAmount: formatNumber(texts[2]!!),
      balance: formatNumber(texts[3]!!),
      notes: texts[4]!!,
    }
  })

  return { ok: true, data }
}
