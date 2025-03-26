import { lazy, type LazyExoticComponent, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes as RoutesContainer } from 'react-router-dom'

const Dashboard = lazy(() => import(/* webpackPrefetch: true */ './Dashboard').then((m) => ({ default: m.DashboardView })))
const Home = lazy(() => import(/* webpackPrefetch: true */ './Home').then((m) => ({ default: m.HomeView })))

import type { Page } from './pages'
import pages from './pages'

const pageElements: Record<string, LazyExoticComponent<() => JSX.Element>> = {
  Dashboard,
  Home
}

const Routes = () => {
  return (
    <BrowserRouter>
      <RoutesContainer>
        {pages.map(({ path, elementName }: Page): ReactNode => {
          const Element = pageElements[elementName]
          return <Route key={path} path={path} element={<Element />} />
        })}
      </RoutesContainer>
    </BrowserRouter>
  )
}

export default Routes
