import { connect } from 'react-redux'

import type { Url } from '../../../models/Url'

import type { AppDispatch, RootState } from '../../../redux/store'
import { selectUrlsLoading, selectUrlsData } from '../../../redux/selectors'
import { findAsync } from '../../../redux/features/urls'

import { HangleSlugView } from './HandleSlugView'

const mapStateToProps = (state: RootState) => {
  return {
    loading: selectUrlsLoading(state),
    url: selectUrlsData(state)[0]
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  findUrlBySlug: async (slug: string): Promise<void> => {
    const result = (await dispatch(findAsync({ slug }))) as { payload: { data?: Array<Url> } }
    const url = result.payload?.data?.[0] as Url

    if (url) {
      window.location.href = url.value
    }
  }
})

export const HandleSlug = connect(mapStateToProps, mapDispatchToProps)(HangleSlugView)
