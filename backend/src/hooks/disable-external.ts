import { MethodNotAllowed } from '@feathersjs/errors'
import type { HookContext } from '../declarations'

export const disableExternal = (context: HookContext) => {
  if (context.params.provider) {
    throw new MethodNotAllowed()
  }
}
