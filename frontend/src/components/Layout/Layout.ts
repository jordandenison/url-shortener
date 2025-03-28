import { connect } from 'react-redux'

import type { RootState } from '../../redux/store'

import { selectCurrentUser, selectUsersLoading } from '../../redux/selectors'
import { LayoutView } from './LayoutView'

const mapStateToProps = (state: RootState) => {
  return {
    loading: selectUsersLoading(state),
    loggedIn: !!selectCurrentUser(state)
  }
}

export const Layout = connect(mapStateToProps)(LayoutView)
