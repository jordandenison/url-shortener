import { lazy, type LazyExoticComponent, type ReactNode, Suspense } from 'react'
import { BrowserRouter, Route, Routes as RoutesContainer } from 'react-router-dom'

const AddUrl = lazy(() => import(/* webpackPrefetch: true */ './AddUrl').then((m) => ({ default: m.AddUrlView })))
const Dashboard = lazy(() => import(/* webpackPrefetch: true */ './Dashboard').then((m) => ({ default: m.DashboardView })))
const EditUrl = lazy(() => import(/* webpackPrefetch: true */ './EditUrl').then((m) => ({ default: m.EditUrlView })))
const HandleSlug = lazy(() => import(/* webpackPrefetch: true */ './HandleSlug').then((m) => ({ default: m.HandleSlugView })))

import type { Page } from './pages'
import pages from './pages'

const pageElements: Record<string, LazyExoticComponent<() => JSX.Element>> = {
  AddUrl,
  Dashboard,
  EditUrl,
  HandleSlug
}

const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <RoutesContainer>
          {pages.map(({ path, elementName }: Page): ReactNode => {
            const Element = pageElements[elementName]
            return <Route key={path} path={path} element={<Element />} />
          })}
        </RoutesContainer>
      </Suspense>
    </BrowserRouter>
  )
}

export default Routes
