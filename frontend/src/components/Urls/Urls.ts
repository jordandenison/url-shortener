import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'
import { selectUrlsData, selectUrlsLimit, selectUrlsLoading, selectUrlsSkip, selectUrlsTotal } from '../../redux/selectors'

import { UrlsView } from './UrlsView'

interface OwnProps {
  guildId: string
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {
    limit: selectUrlsLimit(state),
    loading: selectUrlsLoading(state),
    skip: selectUrlsSkip(state),
    total: selectUrlsTotal(state),
    urls: selectUrlsData(state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch, ownProps: OwnProps) => ({})

export const Polls = connect(mapStateToProps, mapDispatchToProps)(UrlsView)
