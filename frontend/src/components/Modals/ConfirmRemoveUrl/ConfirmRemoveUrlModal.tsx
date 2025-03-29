import { Modal } from '../../Modal/Modal'

interface Props {
  onAccept: () => void
}

export const ConfirmRemoveUrlModal = ({ onAccept }: Props) => {
  return (
    <Modal modalName="confirmRemoveUrl" title="Confirm Remove Url" accept={onAccept} saveButtonText="Remove">
      <h1 className="text-danger text-center">Warning</h1>
      <div className="d-flex justify-content-center align-items-center">
        <i className="bi bi-x-circle text-danger me-3 fs-1" />
        Are you sure you wish to remove this URL? This action cannot be undone.
      </div>
    </Modal>
  )
}
