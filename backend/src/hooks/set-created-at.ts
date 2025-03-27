import type { HookContext } from '../declarations'

export const setCreatedAt = (context: HookContext) => {
  context.data.createdAt = new Date().toISOString()
}
