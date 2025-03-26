import type { ReactNode } from 'react'

import Container from 'react-bootstrap/Container'

interface Props {
  children: ReactNode
}

export const LayoutView = ({ children }: Props) => {
  return <Container className="layout-container">{children}</Container>
}
