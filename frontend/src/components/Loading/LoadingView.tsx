import { type CSSProperties } from 'react'
import Spinner from 'react-bootstrap/Spinner'

interface Props {
  style?: CSSProperties
  text?: string
  className?: string
}

export const LoadingView = ({ className, style, text = 'Loading...' }: Props) => {
  return (
    <div className={`d-flex flex-column justify-content-center align-items-center ${className}`} style={style}>
      <h3 className="mb-3">{text}</h3>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{text}</span>
      </Spinner>
    </div>
  )
}
