'use client'

import { useFormState } from 'react-dom'

import { fetchNaeyuk } from './actions'

const Home: React.FC = () => {
  const [state, formAction] = useFormState(fetchNaeyuk, null)

  return (
    <main>
      <h1>토스 모임통장 거래 내역을 노션에 동기화 해주는 서비스예요.</h1>
      <form
        action={formAction}
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
      {state && <pre>{JSON.stringify(state, null, 2)}</pre>}
    </main>
  )
}

export default Home
