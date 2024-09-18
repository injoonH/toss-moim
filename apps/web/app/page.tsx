'use client'

import { useFormState } from 'react-dom'

import { fetchNaeyuk, syncNotion } from './actions'

const Home: React.FC = () => {
  const [naeyukState, naeyukFormAction] = useFormState(fetchNaeyuk, null)

  return (
    <main>
      <h1>토스 모임통장 거래 내역을 노션에 동기화 해주는 서비스예요.</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <form
          action={naeyukFormAction}
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <div>
            <label htmlFor="date">발급일자</label>
            <input name="date" type="date" required />
          </div>
          <div>
            <label htmlFor="serial">발급번호</label>
            <input name="serial" type="text" required />
          </div>
          <div>
            <button type="submit">불러오기</button>
          </div>
        </form>
        <form
          action={(formData) => {
            if (naeyukState?.ok) syncNotion(naeyukState.data, formData)
          }}
          style={{
            display: 'flex',
            gap: '1rem',
          }}
        >
          <div>
            <label htmlFor="secret">Notion Secret</label>
            <input name="secret" type="text" required />
          </div>
          <div>
            <label htmlFor="databaseId">Notion DB Id</label>
            <input name="databaseId" type="text" required />
          </div>
          <button type="submit" disabled={!naeyukState || !naeyukState.ok}>
            노션 동기화
          </button>
        </form>
      </div>
      <hr />
      <div>총 거래 횟수: {naeyukState?.ok && naeyukState.data.length}</div>
      {naeyukState && <pre>{JSON.stringify(naeyukState.data, null, 2)}</pre>}
    </main>
  )
}

export default Home
