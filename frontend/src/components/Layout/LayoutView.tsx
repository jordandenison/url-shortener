import type { ReactNode } from 'react'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'

import { ThemeSetter } from '../ThemeSetter'
import { LoadingView as Loading } from '../Loading'

import { Header } from '../Header'
import { Auth } from '../Auth'
import { Toasts } from '../Toasts'

import './styles.css'

interface Props {
  children: ReactNode
  loggedIn: boolean
  loading: boolean
}

export const LayoutView = ({ children, loggedIn, loading }: Props) => {
  return (
    <>
      <Container className="layout-container">
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
        ) : loggedIn ? (
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
    </>
  )
}
