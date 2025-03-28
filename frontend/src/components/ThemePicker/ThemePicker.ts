import { connect } from 'react-redux'

import type { AppDispatch, RootState } from '../../redux/store'

import { changeTheme } from '../../redux/features/theme/themeSlice'
import { selectCurrentTheme } from '../../redux/selectors'
import { ThemePickerView } from './ThemePickerView'

const mapStateToProps = (state: RootState) => {
  return {
    currentTheme: selectCurrentTheme(state)
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  changeTheme: (theme: string): void => {
    dispatch(changeTheme({ theme }))
  }
})

export const ThemePicker = connect(mapStateToProps, mapDispatchToProps)(ThemePickerView)
