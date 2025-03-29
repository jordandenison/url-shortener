import { createClient, createCluster } from 'redis'
import type { Application } from '../declarations'

import { logger } from '../logger'

type RedisClient = ReturnType<typeof createClient>
type RedisCluster = ReturnType<typeof createCluster>

export const getClient = (app: Application): RedisClient => {
  const options = {
    socket: {
      host: app.get('redis')?.host,
      port: app.get('redis')?.port,
      tls: app.get('nodeEnv') === 'production' || app.get('nodeEnv') === 'staging'
    },
    password: app.get('redis')?.password
  }

  const client = createClient(options)

  client.on('error', (error: unknown) => {
    const isError = error instanceof Error
    if ((isError && error.message !== 'Socket closed unexpectedly') || !isError) {
      logger.warn(`Redis client error: ${error}`)
    }
  })

  return client
}

export const getClusterClient = (app: Application): RedisCluster => {
  const options = {
    rootNodes: [{ socket: { host: app.get('redis')?.host, port: app.get('redis')?.port } }],
    defaults: {
      password: app.get('redis')?.password,
      socket: {
        tls: app.get('nodeEnv') === 'production' || app.get('nodeEnv') === 'staging'
      }
    }
  }

  const client = createCluster(options)

  client.on('error', (error: unknown) => {
    const isError = error instanceof Error
    if ((isError && error.message !== 'Socket closed unexpectedly') || !isError) {
      logger.warn(`Redis cluster client error: ${error}`)
    }
  })

  return client
}
