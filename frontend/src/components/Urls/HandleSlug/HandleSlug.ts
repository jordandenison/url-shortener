import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../../redux/store'
import { selectUrlsLoading, selectUrlDataBySlug } from '../../../redux/selectors'

import { HangleSlugView } from './HandleSlugView'

interface OwnProps {
  slug: string
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {
    loading: selectUrlsLoading(state),
    url: selectUrlDataBySlug(ownProps.slug, state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({})

export const HandleSlug = connect(mapStateToProps, mapDispatchToProps)(HangleSlugView)
