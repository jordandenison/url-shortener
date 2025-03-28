import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'

import { selectToasts } from '../../redux/selectors'
import { removeToast } from '../../redux/features/toasts/toastsSlice'

import { ToastsView } from './ToastsView'

const mapStateToProps = (state: RootState) => {
  return {
    toasts: selectToasts(state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  removeToast: (id: string): void => {
    dispatch(removeToast({ id }))
  }
})

export const Toasts = connect(mapStateToProps, mapDispatchToProps)(ToastsView)
