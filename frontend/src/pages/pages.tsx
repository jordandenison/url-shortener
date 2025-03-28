export interface Page {
  elementName: string
  name: string
  path: string
  pathRegExp: RegExp
}

const pages: Page[] = [
  {
    name: 'Home',
    elementName: 'Home',
    path: '/',
    pathRegExp: /\/$/
  },
  {
    name: 'Dashboard',
    elementName: 'Dashboard',
    path: '/dashboard',
    pathRegExp: /\/dashboard$/
  }
]

export default pages
