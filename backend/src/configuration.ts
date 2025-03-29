import { Type, getValidator, defaultAppConfiguration } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { dataValidator } from './validators'

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    currentSlug: Type.String(),
    disableCache: Type.Boolean(),
    host: Type.String(),
    nodeEnv: Type.String(),
    postgresqlTest: Type.Object({}),
    port: Type.Number(),
    public: Type.String(),
    redis: Type.Object({
      host: Type.String(),
      password: Type.Optional(Type.String()),
      port: Type.Number()
    })
  })
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)
