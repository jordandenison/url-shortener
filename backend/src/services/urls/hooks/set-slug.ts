import type { HookContext } from '../../../declarations'

import { generateNextSlug } from '../../../helpers/slug'

export const setSlug = (context: HookContext) => {
  if (!context.data.slug) {
    context.data.slug = generateNextSlug(context.app.get('currentSlug'))
    context.params.slugGenerated = true
  }
}
