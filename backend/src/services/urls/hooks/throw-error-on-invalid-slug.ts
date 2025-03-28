import { BadRequest } from '@feathersjs/errors'
import type { HookContext } from '../../../declarations'

import { INVALID_SLUGS } from '../../../constants'

export const throwErrorOnInvalidSlug = (context: HookContext) => {
  if (context.data.slug && INVALID_SLUGS.includes(context.data.slug)) {
    throw new BadRequest(`Invalid slug: ${context.data.slug}`)
  }
}
