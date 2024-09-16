import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Toss Moim',
  description: '토스 모임통장 거래 내역을 노션에 동기화 해주는 서비스예요.',
}

const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <html lang="ko-KR">
    <body>{children}</body>
  </html>
)

export default RootLayout
