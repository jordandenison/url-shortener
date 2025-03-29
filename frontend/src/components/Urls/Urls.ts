import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'
import {
  selectCurrentThemeType,
  selectUrlsData,
  selectUrlsLimit,
  selectUrlsLoading,
  selectUrlsSearch,
  selectUrlsSkip,
  selectUrlsSort,
  selectUrlsSortOrder,
  selectUrlsTotal
} from '../../redux/selectors'
import { closeAll, open } from '../../redux/features/modal'
import { findAsync, removeAsync } from '../../redux/features/urls'
import { createToast } from '../../redux/features/toasts'

import { UrlsView } from './UrlsView'

const mapStateToProps = (state: RootState) => ({
  currentThemeType: selectCurrentThemeType(state),
  limit: selectUrlsLimit(state),
  loading: selectUrlsLoading(state),
  search: selectUrlsSearch(state),
  skip: selectUrlsSkip(state),
  sort: selectUrlsSort(state),
  sortOrder: selectUrlsSortOrder(state),
  total: selectUrlsTotal(state),
  urls: selectUrlsData(state)
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  createToast: (message: string) => {
    dispatch(createToast({ type: 'success', message }))
  },
  findUrls: (search: string, limit: number, skip: number, sort: string, sortOrder: number): void => {
    dispatch(findAsync({ search, limit, skip, sort, sortOrder }))
  },
  openModal: (modalName: string): void => {
    dispatch(open(modalName))
  },
  removeUrl: async (id: number): Promise<void> => {
    await dispatch(removeAsync({ id }))
    dispatch(closeAll())
  }
})

export const Urls = connect(mapStateToProps, mapDispatchToProps)(UrlsView)
