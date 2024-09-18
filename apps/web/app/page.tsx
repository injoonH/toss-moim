'use client'

import { getTableData } from '@repo/naeyuk'
import type { ResponseType } from '@repo/naeyuk/types'
import { useState } from 'react'

const Home: React.FC = () => {
  const [response, setResponse] = useState<ResponseType | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const date = new Date(formData.get('date') as string)
    const serial = formData.get('serial') as string

    setResponse(await getTableData(date, serial))
  }

  return (
    <main>
      <h1>토스 모임통장 거래 내역을 노션에 동기화 해주는 서비스예요.</h1>
      <form
        onSubmit={async (e) => await handleSubmit(e)}
        style={{
          display: 'flex',
          gap: '1rem',
        }}
      >
        <div>
          <label htmlFor="date">발급일자</label>
          <input name="date" type="date" />
        </div>
        <div>
          <label htmlFor="serial">발급번호</label>
          <input name="serial" type="text" />
        </div>
        <div>
          <button type="submit">불러오기</button>
        </div>
      </form>
      <hr />
      {!response ? (
        <div>발급일자와 발급번호를 입력해 거래내역을 불러올 수 있어요.</div>
      ) : response.ok ? (
        <pre>{JSON.stringify(response.data, null, 2)}</pre>
      ) : (
        <div>{response.data.message}</div>
      )}
    </main>
  )
}

export default Home
