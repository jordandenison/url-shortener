// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UserService } from './users.class'

export const userSchema = Type.Object(
  {
    id: Type.Number(),
    username: Type.String(),
    password: Type.String({ minLength: 8 }),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  },
  { $id: 'User', additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)

export const userDataSchema = Type.Pick(userSchema, ['password', 'username'], {
  $id: 'UserData'
})
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)

export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)

export const userQueryProperties = Type.Pick(userSchema, ['id', 'username'])
export const userQuerySchema = Type.Intersect([querySyntax(userQueryProperties), Type.Object({}, { additionalProperties: false })], {
  additionalProperties: false
})
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  id: async (value, user, context) => {
    if (context.params.user) {
      if (context.method === 'get') {
        context.id = context.params.user.id
      }

      return context.params.user.id
    }

    return value
  }
})
