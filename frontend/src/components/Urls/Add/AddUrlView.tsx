import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { LoadingView as Loading } from '../../Loading'

import { UrlForm } from '../../Forms/Url'

interface Props {
  addUrl: (data: UrlData | UrlPatch) => Promise<Url | undefined>
  createToast: (message: string) => void
  loading: boolean
  modifying: boolean
}

export const AddUrlView = ({ addUrl, createToast, loading, modifying }: Props) => {
  const navigate = useNavigate()

  const handleOnSubmit = async (data: UrlData | UrlPatch): Promise<Url | undefined> => {
    return await addUrl(data)
  }

  return loading ? (
    <Loading style={{ marginTop: '32vh' }} />
  ) : (
    <Container>
      <Row className="mb-2">
        <Col>
          <Button onClick={() => navigate('/')}>Back</Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <h4 className="text-center">Enter the URL to shorten</h4>
        </Col>
      </Row>
      <Row>
        <Col md={{ offset: 3, span: 6 }}>
          <UrlForm createToast={createToast} onSubmit={handleOnSubmit} modifying={modifying} />
        </Col>
      </Row>
    </Container>
  )
}
