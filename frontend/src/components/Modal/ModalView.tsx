import { type ReactNode } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

interface Props {
  show: boolean
  close: () => void
  title: string
  children: ReactNode
  accept?: () => void
  saveButtonText?: string
  hideFooter?: boolean
  headerCentered?: boolean
}

export const ModalView = ({ show, accept, close, title, children, saveButtonText = 'Save', hideFooter, headerCentered }: Props) => {
  return (
    <Modal show={show} onHide={close} style={{ marginTop: '10%' }}>
      <Modal.Header
        style={
          headerCentered
            ? {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }
            : {}
        }
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {!hideFooter ? (
        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <Button
            variant="success"
            onClick={() => {
              if (accept) {
                accept()
              }
              close()
            }}
          >
            {saveButtonText}
          </Button>
          <Button className="ms-4" variant="danger" onClick={close}>
            Cancel
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  )
}
