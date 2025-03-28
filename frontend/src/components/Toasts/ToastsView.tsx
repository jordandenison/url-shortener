import { useEffect } from 'react'
import Container from 'react-bootstrap/Container'

import type { Toast } from '../../redux/features/toasts/toastsSlice'

import { NotificationToast } from './components/NotificationToast'

import './styles.css'

interface Props {
  toasts: Toast[]
  removeToast: (id: string) => void
}

export const ToastsView = ({ toasts, removeToast }: Props) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const lastToast = toasts[toasts.length - 1]
        if (lastToast) {
          removeToast(lastToast.id)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [toasts, removeToast])

  return (
    <Container className="toast-container">
      {toasts.map((toast: Toast) => {
        const onClose =
          (id: string): (() => void) =>
          () => {
            removeToast(id)
          }
        return <NotificationToast key={toast.id} toast={toast} onClose={onClose(toast.id)} />
      })}
    </Container>
  )
}
