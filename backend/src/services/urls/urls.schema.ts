// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UrlService } from './urls.class'

export const urlSchema = Type.Object(
  {
    id: Type.Number(),
    value: Type.String(),
    slug: Type.String(),
    visits: Type.Number(),
    userId: Type.Number(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  },
  { $id: 'Url', additionalProperties: false }
)
export type Url = Static<typeof urlSchema>
export const urlValidator = getValidator(urlSchema, dataValidator)

export const urlDataSchema = Type.Object(
  {
    value: Type.String(),
    slug: Type.Optional(Type.String())
  },
  {
    $id: 'UrlData',
    additionalProperties: false
  }
)
export type UrlData = Static<typeof urlDataSchema>
export const urlDataValidator = getValidator(urlDataSchema, dataValidator)

export const urlPatchSchema = Type.Partial(
  Type.Pick(urlSchema, ['value', 'slug'], {
    $id: 'UrlPatch',
    additionalProperties: false
  })
)
export type UrlPatch = Static<typeof urlPatchSchema>
export const urlPatchValidator = getValidator(urlPatchSchema, dataValidator)

export const urlQueryProperties = Type.Pick(urlSchema, ['id', 'slug', 'value', 'visits', 'userId'])
export type UrlQuery = Static<typeof urlQuerySchema>
export const urlQuerySchema = Type.Object(
  {
    ...querySyntax(urlQueryProperties).properties,
    $or: Type.Optional(
      Type.Array(
        Type.Object({
          value: Type.Optional(Type.Object({ $ilike: Type.String() })),
          slug: Type.Optional(Type.Object({ $ilike: Type.String() }))
        })
      )
    )
  },
  { additionalProperties: false }
)
export const urlQueryValidator = getValidator(urlQuerySchema, queryValidator)
export const urlQueryResolver = resolve<UrlQuery, HookContext<UrlService>>({
  userId: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user.id
    }

    return value
  }
})
