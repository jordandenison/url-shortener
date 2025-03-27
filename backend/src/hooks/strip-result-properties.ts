import type { HookContext, NextFunction } from '../declarations'

const removeProperties = (properties: string[], object: Record<string, unknown>) => {
  for (const property of properties) {
    delete object[property]
  }
}

export const stripResultProperties = (properties: string[]) => async (context: HookContext, next: NextFunction) => {
  await next()

  if (context.result.user?.id) {
    context.result.user = JSON.parse(JSON.stringify(context.result.user))
    removeProperties(properties, context.result.user)
    return
  }

  if (context.result && (context.params.provider || context.event)) {
    if (context.result.data && Array.isArray(context.result.data)) {
      context.result.data = context.result.data.map((item: unknown) => {
        const clone = JSON.parse(JSON.stringify(item))
        removeProperties(properties, clone)
        return clone
      })
    } else {
      context.result = JSON.parse(JSON.stringify(context.result))
      removeProperties(properties, context.result)
    }
  }
}
