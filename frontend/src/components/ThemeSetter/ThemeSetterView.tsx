import { useEffect } from 'react'

interface Props {
  currentTheme: string
}

export const ThemeSetterView = ({ currentTheme }: Props) => {
  useEffect(() => {
    window.localStorage?.setItem('currentTheme', currentTheme)

    const newLink = document.createElement('link')
    newLink.id = 'new-theme-stylesheet'
    newLink.setAttribute('rel', 'stylesheet')

    newLink.onload = () => {
      const link = document.getElementById('theme-stylesheet')! as HTMLAnchorElement
      link.remove()
      newLink.id = 'theme-stylesheet'
    }

    newLink.setAttribute('href', `/themes/${currentTheme}.bootstrap.min.css`)
    document.head.appendChild(newLink)
  }, [currentTheme])

  return null
}
