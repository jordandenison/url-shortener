// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

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

export const propertiesToStripExternally = ['password']

export const userDataSchema = Type.Pick(userSchema, ['password', 'username'], {
  $id: 'UserData',
  additionalProperties: false
})
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

export const userPatchSchema = Type.Partial(
  Type.Pick(userSchema, ['password'], {
    $id: 'UserPatch',
    additionalProperties: false
  })
)
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

export const userQueryProperties = Type.Pick(userSchema, ['id', 'username'])
export const userQuerySchema = Type.Intersect([querySyntax(userQueryProperties), Type.Object({}, { additionalProperties: false })], {
  additionalProperties: false
})
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  id: async (value, user, context) => {
    if (context.params.user) {
      if (context.params.query) {
        context.params.query.id = context.params.user.id
      } else {
        context.params.query = { id: context.params.user.id }
      }

      return context.params.user.id
    }

    return value
  }
})
