import type { HookContext } from '../../../declarations'

export const setVisits = (context: HookContext) => {
  context.data.visits = 0
}
