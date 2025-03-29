import { Type, getValidator, defaultAppConfiguration } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { dataValidator } from './validators'

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    currentSlug: Type.String(),
    host: Type.String(),
    postgresqlTest: Type.Object({}),
    port: Type.Number(),
    public: Type.String()
  })
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)
