import type { HookContext } from '../declarations'

export const setUpdatedAt = (context: HookContext) => {
  context.data.updatedAt = new Date().toISOString()
}
