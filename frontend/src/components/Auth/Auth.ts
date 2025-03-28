import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'
import { createAsync, loginAsync } from '../../redux/features/users/usersSlice'
import { selectUsersLoading, selectCurrentUser } from '../../redux/selectors'

import { AuthView } from './AuthView'

const mapStateToProps = (state: RootState) => ({
  currentUser: selectCurrentUser(state),
  loading: selectUsersLoading(state)
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  login: (username: string, password: string): void => {
    dispatch(loginAsync({ username, password }))
  },
  register: (username: string, password: string): void => {
    dispatch(createAsync({ data: { username, password } }))
  }
})

export const Auth = connect(mapStateToProps, mapDispatchToProps)(AuthView)
