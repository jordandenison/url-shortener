import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { Modal } from '../../Modal'
import { LoadingView as Loading } from '../../Loading'

import { UrlForm } from '../../Forms/Url'

interface Props {
  createToast: (message: string) => void
  load: (urlId: string) => void
  loading: boolean
  modifying: boolean
  openModal: (modalName: string) => void
  patchUrl: (data: UrlPatch) => Promise<Url | undefined>
  removeUrl: () => Promise<void>
  urlId: string

  url?: Url
}

export const EditUrlView = ({ createToast, load, loading, openModal, modifying, patchUrl, removeUrl, url, urlId }: Props) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!url) {
      load(urlId)
    }
  }, [load, url, urlId])

  const handleConfirmRemoveUrl = async (): Promise<void> => {
    await removeUrl()
    navigate('/')
  }

  const handleOnSubmit = async (data: UrlData | UrlPatch): Promise<Url | undefined> => {
    return await patchUrl(data)
  }

  return loading ? (
    <Loading style={{ marginTop: '32vh' }} />
  ) : (
    <Container>
      <Row className="mb-3">
        <Col md={3}>
          <Button onClick={() => navigate('/')}>Back</Button>
        </Col>
        <Col className="text-end" md={{ offset: 6, span: 3 }}>
          <Button variant="danger" onClick={() => openModal('confirmRemoveUrl')}>
            Remove URL
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={{ offset: 3, span: 6 }}>
          <UrlForm createToast={createToast} onSubmit={handleOnSubmit} modifying={modifying} url={url} />
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
