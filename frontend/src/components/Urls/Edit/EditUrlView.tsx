import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import type { Url, UrlPatch } from '../../../models/Url'

import { Modal } from '../../Modal'
import { LoadingView as Loading } from '../../Loading'

interface Props {
  loading: boolean
  openModal: (modalName: string) => void
  patchUrl: (data: UrlPatch) => void
  removeUrl: () => Promise<void>

  url?: Url
}

export const EditUrlView = ({ loading, openModal, patchUrl, removeUrl, url }: Props) => {
  const navigate = useNavigate()

  const handleConfirmRemoveUrl = async (): Promise<void> => {
    await removeUrl()
    navigate('/')
  }

  return loading ? (
    <Loading style={{ marginTop: '32vh' }} />
  ) : (
    <Container>
      <Row className="mb-3">
        <Col md={2}>
          <Button id="poll-detail-view-back-button" onClick={() => navigate('/')}>
            Back
          </Button>
        </Col>
        <Col md={{ offset: 1, span: 6 }}>Edit Url</Col>
        <Col className="text-end" md={{ offset: 1, span: 2 }}>
          <Button variant="danger" className="mb-3" onClick={() => openModal('confirmRemoveUrl')}>
            Remove URL
          </Button>
        </Col>
      </Row>
      <Modal modalName="confirmRemoveUrl" title="Confirm Remove Url" accept={handleConfirmRemoveUrl} saveButtonText="Remove">
        <h1 className="text-danger text-center">Warning</h1>
        <div className="d-flex justify-content-center align-items-center">
          <i className="bi bi-x-circle text-danger me-3 fs-1" />
          Are you sure you wish to remove this URL? This action cannot be undone.
        </div>
      </Modal>
    </Container>
  )
}
