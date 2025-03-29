import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../../redux/store'
import { selectUrlData, selectUrlsLoading, selectUrlsModifying } from '../../../redux/selectors'
import { removeAsync, patchAsync } from '../../../redux/features/urls'
import { closeAll, open } from '../../../redux/features/modal/modalSlice'

import type { UrlPatch } from '../../../models/Url'

import { EditUrlView } from './EditUrlView'

interface OwnProps {
  urlId: string
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {
    loading: selectUrlsLoading(state),
    modifying: selectUrlsModifying(state),
    url: selectUrlData(+ownProps.urlId, state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, ownProps: OwnProps) => ({
  openModal: (modalName: string): void => {
    dispatch(open(modalName))
  },
  patchUrl: (data: UrlPatch): void => {
    dispatch(patchAsync({ id: +ownProps.urlId, data }))
  },
  removeUrl: async (): Promise<void> => {
    await dispatch(removeAsync({ id: +ownProps.urlId }))
    dispatch(closeAll())
  }
})

export const EditUrl = connect(mapStateToProps, mapDispatchToProps)(EditUrlView)
