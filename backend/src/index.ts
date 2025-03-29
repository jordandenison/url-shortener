import { app } from './app'
import { logger } from './logger'

import { delay } from './helpers/util'
import { Cache } from './helpers/cache.class'
import { getClient, getClusterClient } from './helpers/redis'

const port = app.get('port')
const host = app.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection', reason))
process.on('uncaughtException', (error: unknown) => logger.error('Uncaught Exception', error))

const cacheSetupRetryInterval = 30000 // 30 seconds
let redisConnecting = false

const start = async () => {
  const {
    data: [mostRecentUrl]
  } = await app.service('urls').find({ query: { $sort: { id: -1 }, $limit: 1 } })

  if (mostRecentUrl) {
    app.set('currentSlug', mostRecentUrl.slug)
  }

  await app.listen(port)

  logger.info(`Deep Origin Url Shortener listening on http://${host}:${port}`)

  const setupCache = async () => {
    if (redisConnecting) {
      return
    }

    redisConnecting = true

    try {
      const redisClient = app.get('nodeEnv') === 'production' ? getClusterClient(app) : getClient(app)
      await redisClient.connect()

      Cache.getInstance().setClient(redisClient)

      redisClient.on('end', async () => {
        redisConnecting = false
        logger.warn('Redis connection lost. Reconnecting...')
        await setupCache()
      })
    } catch (error: unknown) {
      await delay(cacheSetupRetryInterval)
      logger.warn(`Cache setup error: ${error}. Retrying in ${cacheSetupRetryInterval / 1000} seconds...`)
      redisConnecting = false
      await setupCache()
    }
  }

  await setupCache()
}

start()
