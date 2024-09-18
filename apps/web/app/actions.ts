'use server'

import { getTableData } from '@repo/naeyuk'
import type { ResponseType } from '@repo/naeyuk/types'

export const fetchNaeyuk = async (
  prevState: ResponseType | null,
  formData: FormData,
) => {
  const date = new Date(formData.get('date') as string)
  const serial = formData.get('serial') as string

  return getTableData(date, serial)
}
