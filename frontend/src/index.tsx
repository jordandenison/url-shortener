import { createRoot } from 'react-dom/client'
import client from './lib/feathers/feathersClient'
import { SyncManager } from './lib/feathers/syncManager'

import App from './App'

if (window.localStorage.getItem('feathers-jwt') || window.localStorage.getItem('feathers-rt')) {
  client.reAuthenticate()
}

client.on('login', () => {
  SyncManager.init()
})

const createThemeStylesheetLink = (theme: string): void => {
  const link = document.createElement('link')
  link.id = 'theme-stylesheet'
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', `/themes/${theme}.bootstrap.min.css`)
  document.head.appendChild(link)
}

createThemeStylesheetLink(window.localStorage?.getItem('currentTheme')!)

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(<App />)
