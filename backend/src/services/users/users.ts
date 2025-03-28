// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  userDataResolver,
  userDataValidator,
  userPatchResolver,
  userPatchValidator,
  userQueryValidator,
  userQueryResolver,
  propertiesToStripExternally
} from './users.schema'

import type { Application } from '../../declarations'

import { disableExternal } from '../../hooks/disable-external'
import { setCreatedAt } from '../../hooks/set-created-at'
import { setUpdatedAt } from '../../hooks/set-updated-at'
import { stripResultProperties } from '../../hooks/strip-result-properties'

import { UserService, getOptions } from './users.class'
import { userPath, userMethods } from './users.shared'

export * from './users.class'
export * from './users.schema'

export const user = (app: Application) => {
  app.use(userPath, new UserService(getOptions(app)), {
    methods: userMethods,
    events: []
  })
  app.service(userPath).hooks({
    around: {
      all: [stripResultProperties(propertiesToStripExternally)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      patch: [authenticate('jwt')]
    },
    before: {
      all: [schemaHooks.validateQuery(userQueryValidator), schemaHooks.resolveQuery(userQueryResolver)],
      create: [schemaHooks.validateData(userDataValidator), schemaHooks.resolveData(userDataResolver), setCreatedAt, setUpdatedAt],
      patch: [schemaHooks.validateData(userPatchValidator), schemaHooks.resolveData(userPatchResolver), setUpdatedAt],
      remove: [disableExternal]
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [userPath]: UserService
  }
}
