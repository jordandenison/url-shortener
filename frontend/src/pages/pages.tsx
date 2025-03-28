export interface Page {
  elementName: string
  name: string
  path: string
  pathRegExp: RegExp
}

const pages: Page[] = [
  {
    name: 'Dashboard',
    elementName: 'Dashboard',
    path: '/',
    pathRegExp: /\/$/
  },
  {
    name: 'Add Url',
    elementName: 'AddUrl',
    path: '/add',
    pathRegExp: /\/add$/
  },
  {
    name: 'Edit Url',
    elementName: 'EditUrl',
    path: '/edit/:id',
    pathRegExp: /\/edit\/[\w-]+$/
  },
  {
    name: 'Handle Slug',
    elementName: 'HandleSlug',
    path: '/:slug',
    pathRegExp: /\/[\w-]+$/
  }
]

export default pages
