import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export const themes = [
  'cerulean',
  'cosmo',
  'cyborg',
  'darkly',
  'flatly',
  'journal',
  'litera',
  'lumen',
  'lux',
  'materia',
  'minty',
  'pulse',
  'sandstone',
  'simplex',
  'sketchy',
  'slate',
  'solar',
  'spacelab',
  'superhero',
  'united',
  'vapor',
  'yeti',
  'zephyr'
]

export const darkThemes = ['cyborg', 'darkly', 'slate', 'solar', 'superhero', 'vapor']

export const lightThemes = [
  'cerulean',
  'cosmo',
  'flatly',
  'journal',
  'litera',
  'lumen',
  'lux',
  'materia',
  'minty',
  'pulse',
  'sandstone',
  'simplex',
  'sketchy',
  'spacelab',
  'united',
  'yeti',
  'zephyr'
]

const getThemeType = (theme: string): string => {
  const index = lightThemes.indexOf(theme)
  return index === -1 ? 'dark' : 'light'
}

export interface ThemeState {
  currentTheme: string
  currentThemeType: string
}

const defaultTheme = 'cerulean'
if (!window.localStorage?.getItem('currentTheme')) {
  window.localStorage?.setItem('currentTheme', defaultTheme)
}

const initialState: ThemeState = {
  currentTheme: localStorage.getItem('currentTheme')!,
  currentThemeType: getThemeType(localStorage.getItem('currentTheme')!)
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<{ theme: string }>): void => {
      state.currentTheme = action.payload.theme
      state.currentThemeType = getThemeType(action.payload.theme)
    }
  }
})

export const { changeTheme } = themeSlice.actions

export default themeSlice.reducer
