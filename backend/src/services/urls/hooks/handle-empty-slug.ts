import type { HookContext } from '../../../declarations'

export const handleEmptySlug = (context: HookContext) => {
  if (context.data?.slug === '') {
    delete context.data.slug
  }
}
