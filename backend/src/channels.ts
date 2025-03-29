import type { Params } from '@feathersjs/feathers'
import '@feathersjs/transport-commons'
import type { Application } from './declarations'
import { Url } from './services/urls/urls.schema'

export const channels = (app: Application) => {
  app.on('login', async (_, { connection }: Params) => {
    if (connection && connection.user) {
      app.channel(`${connection.user.id}`).join(connection)
    }
  })

  app.service('urls').publish('patched', (data: unknown) => {
    if (typeof data === 'object' && data !== null && 'userId' in data) {
      return app.channel(`${(data as Url).userId}`)
    }
  })
}
