import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../../redux/store'
import { selectUrlsLoading, selectUrlsModifying } from '../../../redux/selectors'
import { closeAll, open } from '../../../redux/features/modal/modalSlice'
import { createAsync } from '../../../redux/features/urls'

import type { Url, UrlData } from '../../../models/Url'

import { AddUrlView } from './AddUrlView'

const mapStateToProps = (state: RootState) => {
  return {
    loading: selectUrlsLoading(state),
    modifying: selectUrlsModifying(state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  openModal: (modalName: string): void => {
    dispatch(open(modalName))
  },
  addUrl: async (data: UrlData): Promise<Url | undefined> => {
    dispatch(closeAll())
    try {
      const result = await dispatch(createAsync({ data }))
      return result.payload as Url
    } catch (e: unknown) {
      return
    }
  }
})

export const AddUrl = connect(mapStateToProps, mapDispatchToProps)(AddUrlView)
