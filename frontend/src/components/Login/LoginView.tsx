// import Button from 'react-bootstrap/Button'
// import Spinner from 'react-bootstrap/Spinner'

import type { User } from '../../models/User'

interface Props {
  onClick: (username: string, password: string) => void
  currentUser?: User
  loading: boolean
}

export const LoginView = ({ onClick, currentUser, loading }: Props) => {
  return currentUser ? <div>'Logged in'</div> : <div>Please login</div>
}
