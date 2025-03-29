import type { HookContext } from '../declarations'
import { Cache } from '../helpers/cache.class'

const cacheExpiry = 1800000 // 30 minutes

const getCacheKey = (context: HookContext) => {
  return `${context.service}-id-${context.params.user?.id}-${context.id}`
}

export const handleCacheGet = async <T>(context: HookContext) => {
  if (!context.app.get('disableCache')) {
    const cacheResult = await Cache.getInstance().get<T | T[]>(getCacheKey(context))

    if (cacheResult) {
      context.result = cacheResult

      return context
    }
  }
}

export const handleCacheSet = async <T>(context: HookContext) => {
  if (!context.app.get('disableCache') && context.result) {
    await Cache.getInstance().set<T | T[]>(getCacheKey(context), context.result, cacheExpiry)
  }
}
