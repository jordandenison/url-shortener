export interface Page {
  elementName: string
  name: string
  path: string
  pathRegExp: RegExp

  secure?: boolean
}

const pages: Page[] = [
  {
    name: 'Dashboard',
    elementName: 'Dashboard',
    path: '/',
    pathRegExp: /\/$/,
    secure: true
  },
  {
    name: 'Add Url',
    elementName: 'AddUrl',
    path: '/add',
    pathRegExp: /\/add$/,
    secure: true
  },
  {
    name: 'Edit Url',
    elementName: 'EditUrl',
    path: '/edit/:urlId',
    pathRegExp: /\/edit\/[\w-]+$/,
    secure: true
  },
  {
    name: 'Handle Slug',
    elementName: 'HandleSlug',
    path: '/:slug',
    pathRegExp: /\/[\w-]+$/
  }
]

export default pages
