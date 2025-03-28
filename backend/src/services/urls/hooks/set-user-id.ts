import type { HookContext } from '../../../declarations'

export const setUserId = (context: HookContext) => {
  context.data.userId = context.params.user.id
}
