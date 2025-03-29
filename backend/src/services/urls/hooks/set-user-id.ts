import type { HookContext } from '../../../declarations'

export const setUserId = (context: HookContext) => {
  if (context.params.user) {
    context.data.userId = context.params.user.id
  }
}
