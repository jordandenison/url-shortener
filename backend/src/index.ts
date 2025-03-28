import { app } from './app'
import { logger } from './logger'

const port = app.get('port')
const host = app.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection', reason))
process.on('uncaughtException', (error: unknown) => logger.error('Uncaught Exception', error))

const start = async () => {
  const {
    data: [mostRecentUrl]
  } = await app.service('urls').find({ query: { $sort: { id: -1 }, $limit: 1 } })

  if (mostRecentUrl) {
    app.set('currentSlug', mostRecentUrl.slug)
  }

  await app.listen(port)

  logger.info(`Deep Origin Url Shortener listening on http://${host}:${port}`)
}

start()
