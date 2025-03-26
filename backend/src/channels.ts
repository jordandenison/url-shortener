import type { Params } from '@feathersjs/feathers'
import '@feathersjs/transport-commons'
import type { Application } from './declarations'

export const channels = (app: Application) => {
  app.on('login', async (_, { connection }: Params) => {
    if (connection && connection.user) {
      app.channel(connection.user.id).join(connection)
    }
  })
}
