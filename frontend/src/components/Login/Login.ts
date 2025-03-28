import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'
import { loginAsync } from '../../redux/features/users/usersSlice'
import { selectUsersLoading, selectCurrentUser } from '../../redux/selectors'

import { LoginView } from './LoginView'

const mapStateToProps = (state: RootState) => ({
  currentUser: selectCurrentUser(state),
  loading: selectUsersLoading(state)
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onClick: (username: string, password: string): void => {
    dispatch(loginAsync({ username, password }))
  }
})

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginView)
