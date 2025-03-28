import { useEffect } from 'react'
import ReactToast from 'react-bootstrap/Toast'

import type { Toast } from '../../../redux/features/toasts/toastsSlice'

import { TOAST_TIMEOUTS_BY_TYPE } from '../../../config/config'
import { capitalizeFirstLetter } from '../../../lib/util'

import './styles.css'

interface Props {
  toast: Toast
  onClose: () => void
}

const bootstrapBgByType = {
  info: 'info',
  success: 'success',
  alert: 'warning',
  error: 'danger'
}

export const NotificationToast = ({ toast, onClose }: Props) => {
  useEffect(() => {
    setTimeout(onClose, TOAST_TIMEOUTS_BY_TYPE[toast.type])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ReactToast onClose={onClose} className="rtninja-toast-container" bg={bootstrapBgByType[toast.type]}>
      <ReactToast.Header>
        <strong className="me-auto">{capitalizeFirstLetter(toast.type)}</strong>
      </ReactToast.Header>
      <ReactToast.Body>{toast.message}</ReactToast.Body>
    </ReactToast>
  )
}
