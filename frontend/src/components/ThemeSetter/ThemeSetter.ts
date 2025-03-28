import { connect } from 'react-redux'

import type { RootState } from '../../redux/store'

import { selectCurrentTheme } from '../../redux/selectors'
import { ThemeSetterView } from './ThemeSetterView'

const mapStateToProps = (state: RootState) => {
  return {
    currentTheme: selectCurrentTheme(state)
  }
}

export const ThemeSetter = connect(mapStateToProps)(ThemeSetterView)
