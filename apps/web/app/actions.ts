'use server'

import { Client } from '@notionhq/client'
import { getTableData } from '@repo/naeyuk'
import type { ResponseType, RowData } from '@repo/naeyuk/types'

export const fetchNaeyuk = async (
  prevState: ResponseType | null,
  formData: FormData,
) => {
  const date = new Date(formData.get('date') as string)
  const serial = formData.get('serial') as string

  return getTableData(date, serial)
}

export const syncNotion = async (data: RowData[], formData: FormData) => {
  console.log('Sync Start.')

  const secret = formData.get('secret') as string
  const databaseId = formData.get('databaseId') as string

  const notion = new Client({ auth: secret })

  for (const row of data) {
    await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        내용: {
          type: 'title',
          title: [{ type: 'text', text: { content: row.notes } }],
        },
        거래일자: {
          type: 'date',
          date: { start: row.datetime, time_zone: 'Asia/Seoul' },
        },
        구분: {
          type: 'select',
          select: { name: row.remarks },
        },
        금액: {
          type: 'number',
          number: row.transactionAmount,
        },
        잔액: {
          type: 'number',
          number: row.balance,
        },
      },
    })
  }

  console.log('Sync Done.')
}
