import type { User } from '../../models/User'

import { AuthForm } from '../Forms/Auth/AuthForm'

interface Props {
  loading: boolean
  login: (username: string, password: string) => void
  register: (username: string, password: string) => void

  currentUser?: User
}

export const AuthView = ({ currentUser, loading, login, register }: Props) => {
  return <AuthForm loading={loading} onLogin={login} onRegister={register} />
}
