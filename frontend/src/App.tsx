import { useEffect, useState } from 'react'

import ReactReduxProvider from './redux/Provider'
import Routes from './pages/Routes'

import './App.css'

const App = () => {
  const [isCssLoaded, setIsCssLoaded] = useState(false)

  useEffect(() => {
    const handleCssLoad = () => setIsCssLoaded(true)
    const link = document.getElementById('theme-stylesheet') as HTMLLinkElement

    if (link) {
      link.addEventListener('load', handleCssLoad)
      if (link.sheet) {
        setIsCssLoaded(true)
      }
      return () => link.removeEventListener('load', handleCssLoad)
    }
  }, [])

  if (process.env.NODE_ENV !== 'test' && !isCssLoaded) {
    return <div></div>
  }

  return (
    <ReactReduxProvider>
      <Routes />
    </ReactReduxProvider>
  )
}

export default App
