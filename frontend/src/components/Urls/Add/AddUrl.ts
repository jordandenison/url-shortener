import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../../redux/store'
import { selectUrlsLoading, selectUrlsModifying } from '../../../redux/selectors'
import { createAsync } from '../../../redux/features/urls'
import { createToast } from '../../../redux/features/toasts'

import type { Url, UrlData, UrlPatch } from '../../../models/Url'

import { AddUrlView } from './AddUrlView'

const mapStateToProps = (state: RootState) => {
  return {
    loading: selectUrlsLoading(state),
    modifying: selectUrlsModifying(state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addUrl: async (data: UrlData | UrlPatch): Promise<Url | undefined> => {
    try {
      const result = await dispatch(createAsync({ data: data as UrlData }))
      return result.payload as Url
    } catch (e: unknown) {
      return
    }
  },
  createToast: (message: string) => {
    dispatch(createToast({ type: 'success', message }))
  }
})

export const AddUrl = connect(mapStateToProps, mapDispatchToProps)(AddUrlView)
