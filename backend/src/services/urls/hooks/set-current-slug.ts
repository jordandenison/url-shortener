import type { HookContext } from '../../../declarations'

export const setCurrentSlug = (context: HookContext) => {
  if (context.result.slug) {
    context.app.set('currentSlug', context.result.slug)
  }
}
