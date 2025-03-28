import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'

import { logoutAsync } from '../../redux/features/users/usersSlice'
import { selectCurrentUser, selectCurrentThemeType, selectUsersLoading } from '../../redux/selectors'

import { HeaderView } from './HeaderView'

const mapStateToProps = (state: RootState) => {
  return {
    loading: selectUsersLoading(state),
    currentUser: selectCurrentUser(state),
    currentThemeType: selectCurrentThemeType(state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  logout: (): void => {
    dispatch(logoutAsync())
  }
})

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderView)
