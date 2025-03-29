import type { createClient, createCluster } from 'redis'

import { logger } from '../logger'

export class Cache {
  private static instance: Cache

  static getInstance = (): Cache => {
    if (!Cache.instance) {
      Cache.instance = new Cache()
    }
    return Cache.instance
  }

  private client!: ReturnType<typeof createClient> | ReturnType<typeof createCluster>

  private constructor() {}

  setClient = (client: ReturnType<typeof createClient> | ReturnType<typeof createCluster>): Cache => {
    this.client = client
    return Cache.instance
  }

  get = async <T>(key: string): Promise<T | null> => {
    try {
      const data = await this.client.get(`cache:${key}`)
      return data ? (JSON.parse(data) as T) : null
    } catch (error: unknown) {
      logger.error(`Cache.get error: ${error}`)
      return null
    }
  }

  set = async <T>(key: string, data: T, ttl?: number): Promise<void> => {
    try {
      await this.client.set(`cache:${key}`, JSON.stringify(data), ttl ? { PX: ttl } : undefined)
    } catch (error: unknown) {
      logger.error(`Cache.set error: ${error}`)
    }
  }
}
