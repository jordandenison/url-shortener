import { authenticate } from '@feathersjs/authentication'

import type { HookContext, NextFunction } from '../../../declarations'

export const handleAnonFind = async (context: HookContext, next: NextFunction) => {
  if (context.params.query.slug && Object.keys(context.params.query).length === 1) {
    context.result = await context.service.find({ query: { slug: context.params.query.slug, $select: ['value', 'visits'] } })

    const url = context.result.data[0]

    if (url) {
      await context.service.patch(url.id, { visits: url.visits + 1 })

      delete context.result.data[0].id
      delete context.result.data[0].visits
    }

    return context
  }

  await authenticate('jwt')(context)

  return next()
}
