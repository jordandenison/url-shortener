// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Url, UrlData, UrlPatch, UrlQuery } from './urls.schema'

export type { Url, UrlData, UrlPatch, UrlQuery }

export interface UrlParams extends KnexAdapterParams<UrlQuery> {}

export class UrlService<ServiceParams extends Params = UrlParams> extends KnexService<Url, UrlData, UrlParams, UrlPatch> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'urls'
  }
}
