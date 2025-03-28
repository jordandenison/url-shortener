import { type CSSProperties, type ReactNode } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import { lightThemes, themes } from '../../redux/features/theme/themeSlice'

interface Props {
  changeTheme: (theme: string) => void
  currentTheme: string
  style?: CSSProperties
}

export const ThemePickerView = ({ changeTheme, currentTheme, style }: Props) => {
  return (
    <Dropdown style={style}>
      <Dropdown.Toggle variant="info">Change Theme</Dropdown.Toggle>

      <Dropdown.Menu>
        {themes.map((theme: string): ReactNode => {
          const themeIsLight = lightThemes.includes(theme)
          return (
            <Dropdown.Item active={theme === currentTheme} key={theme} onClick={() => changeTheme(theme)}>
              <i className={`bi bi-brightness-high${themeIsLight ? '' : '-fill'} me-2`} />
              {theme}
            </Dropdown.Item>
          )
        })}
      </Dropdown.Menu>
    </Dropdown>
  )
}
