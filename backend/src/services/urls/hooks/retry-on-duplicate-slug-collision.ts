import type { HookContext } from '../../../declarations'

import { generateNextSlug } from '../../../helpers/slug'

const duplicateErrorMessage = 'duplicate key value violates unique constraint'
const duplicateErrorHint = 'urls_slug_unique'

export const retryOnDuplicateSlugCollision = async (context: HookContext) => {
  const errorMessage = context.error?.message?.toLowerCase()
  if (errorMessage.includes(duplicateErrorHint) && errorMessage.includes(duplicateErrorMessage) && context.params.slugGenerated) {
    context.result = await context.app.service('urls').create(
      {
        value: context.data.value,
        slug: generateNextSlug(context.data.slug)
      },
      {
        ...context.params,
        provider: undefined
      }
    )
  }
}
