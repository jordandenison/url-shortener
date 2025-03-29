import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import type { Url } from '../../../models/Url'

interface Props {
  findUrlBySlug: (slug: string) => Promise<void>
  loading: boolean
  slug: string

  url?: Url
}

export const HangleSlugView = ({ findUrlBySlug, loading, slug, url }: Props) => {
  const navigate = useNavigate()

  useEffect(() => {
    findUrlBySlug(slug)
  }, [findUrlBySlug, slug])

  return (
    !loading &&
    !url && (
      <Container className="text-center mt-5">
        <Row>
          <Col>
            <h1 className="display-4">404</h1>
            <p className="lead">Page not found</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </Col>
        </Row>
      </Container>
    )
  )
}
