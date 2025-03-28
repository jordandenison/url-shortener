import Container from 'react-bootstrap/Container'

import { AuthForm } from '../Forms/Auth/AuthForm'

interface Props {
  loading: boolean
  login: (username: string, password: string) => void
  register: (username: string, password: string) => void
}

export const AuthView = ({ loading, login, register }: Props) => {
  return (
    <Container className="mt-5 mx-auto" style={{ maxWidth: '400px' }}>
      <AuthForm loading={loading} onLogin={login} onRegister={register} />
    </Container>
  )
}
