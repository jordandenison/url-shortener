import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../../redux/store'
import { selectUrlData, selectUrlsLoading, selectUrlsModifying } from '../../../redux/selectors'
import { findAsync, removeAsync, patchAsync } from '../../../redux/features/urls'
import { closeAll, open } from '../../../redux/features/modal/modalSlice'
import { createToast } from '../../../redux/features/toasts'

import type { Url, UrlPatch } from '../../../models/Url'

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
  createToast: (message: string) => {
    dispatch(createToast({ type: 'success', message }))
  },
  load: (urlId: string): void => {
    dispatch(findAsync({ id: +urlId }))
  },
  openModal: (modalName: string): void => {
    dispatch(open(modalName))
  },
  patchUrl: async (data: UrlPatch): Promise<Url | undefined> => {
    try {
      const result = await dispatch(patchAsync({ id: +ownProps.urlId, data }))
      return result.payload as Url
    } catch (e: unknown) {
      return
    }
  },
  removeUrl: async (): Promise<void> => {
    await dispatch(removeAsync({ id: +ownProps.urlId }))
    dispatch(closeAll())
  }
})

export const EditUrl = connect(mapStateToProps, mapDispatchToProps)(EditUrlView)
