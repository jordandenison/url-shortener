import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { LoadingView as Loading } from '../../Loading'

import type { Url, UrlData } from '../../../models/Url'

// import { UrlForm } from './components/UrlForm'

interface Props {
  addUrl: (data: UrlData) => Promise<Url | undefined>
  loading: boolean
  modifying: boolean
  openModal: (modalName: string) => void
}

export const AddUrlView = ({ addUrl, loading, modifying }: Props) => {
  const navigate = useNavigate()

  const handleOnSubmit = async (data: UrlData): Promise<void> => {
    const url = await addUrl(data)
    if (url) {
      navigate('/')
    }
  }

  return loading ? (
    <Loading style={{ marginTop: '32vh' }} />
  ) : (
    <Container>
      New Url
      <Row style={{ width: '60%', margin: '0 auto' }}>
        <Col>
          {/* <PollForm
            onSubmit={handleOnSubmit}
            modifying={modifying}
          /> */}
        </Col>
      </Row>
    </Container>
  )
}
