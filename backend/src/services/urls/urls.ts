// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import { urlDataValidator, urlPatchValidator, urlQueryValidator, urlQueryResolver } from './urls.schema'

import type { Application } from '../../declarations'

import { setCreatedAt } from '../../hooks/set-created-at'
import { setUpdatedAt } from '../../hooks/set-updated-at'

import { handleAnonFind } from './hooks/handle-anon-find'
import { handleEmptySlug } from './hooks/handle-empty-slug'
import { retryOnDuplicateSlugCollision } from './hooks/retry-on-duplicate-slug-collision'
import { setCurrentSlug } from './hooks/set-current-slug'
import { setSlug } from './hooks/set-slug'
import { setVisits } from './hooks/set-visits'
import { setUserId } from './hooks/set-user-id'
import { throwErrorOnInvalidSlug } from './hooks/throw-error-on-invalid-slug'

import { UrlService, getOptions } from './urls.class'
import { urlPath, urlMethods } from './urls.shared'

export * from './urls.class'
export * from './urls.schema'

export const url = (app: Application) => {
  app.use(urlPath, new UrlService(getOptions(app)), {
    methods: urlMethods,
    events: []
  })
  app.service(urlPath).hooks({
    around: {
      find: [handleAnonFind],
      get: [authenticate('jwt')],
      create: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [schemaHooks.validateQuery(urlQueryValidator), schemaHooks.resolveQuery(urlQueryResolver)],
      create: [handleEmptySlug, schemaHooks.validateData(urlDataValidator), throwErrorOnInvalidSlug, setSlug, setCreatedAt, setUpdatedAt, setVisits, setUserId],
      patch: [handleEmptySlug, schemaHooks.validateData(urlPatchValidator), setSlug, throwErrorOnInvalidSlug, setUpdatedAt]
    },
    after: {
      create: [setCurrentSlug],
      patch: [setCurrentSlug]
    },
    error: {
      create: [retryOnDuplicateSlugCollision]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [urlPath]: UrlService
  }
}
