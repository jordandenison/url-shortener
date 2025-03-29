import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'

import { LoadingView as Loading } from '../Loading'

import pages, { type Page } from '../../pages/pages'

import { Auth } from '../Auth'
import { Header } from '../Header'
import { ThemeSetter } from '../ThemeSetter'
import { Toasts } from '../Toasts'

interface Props {
  children: ReactNode
  loggedIn: boolean
  loading: boolean
}

export const LayoutView = ({ children, loggedIn, loading }: Props) => {
  const { pathname } = useLocation()

  const { secure } = pages.find((page: Page): boolean => {
    return page.pathRegExp.test(pathname)
  })!

  return (
    <Container className="mx-auto px-3" style={{ maxWidth: '800px', minWidth: '600px' }}>
      <ThemeSetter />
      <Toasts />
      <Row style={{ height: '70px' }}>
        <Header />
      </Row>
      {loading ? (
        <Row style={{ minHeight: '50vh' }}>
          <Col style={{ padding: '15px' }}>
            <Loading />
          </Col>
        </Row>
      ) : !secure || (loggedIn && secure) ? (
        <Row style={{ minHeight: '50vh' }}>
          <Col style={{ padding: '15px' }}>{children}</Col>
        </Row>
      ) : (
        <Row style={{ minHeight: '50vh' }}>
          <Col className="text-center">
            <h3 className="loading-header">
              <Auth />
            </h3>
          </Col>
        </Row>
      )}
    </Container>
  )
}
