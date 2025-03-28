// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Url, UrlData, UrlPatch, UrlQuery, UrlService } from './urls.class'

export type { Url, UrlData, UrlPatch, UrlQuery }

export type UrlClientService = Pick<UrlService<Params<UrlQuery>>, (typeof urlMethods)[number]>

export const urlPath = 'urls'

export const urlMethods: Array<keyof UrlService> = ['find', 'get', 'create', 'patch', 'remove']

export const urlClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(urlPath, connection.service(urlPath), {
    methods: urlMethods
  })
}

declare module '../../client' {
  interface ServiceTypes {
    [urlPath]: UrlClientService
  }
}
