import knex from 'knex'
import { knexSnakeCaseMappers } from 'objection'
import type { Knex } from 'knex'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    postgresqlClient: Knex
  }
}

export const postgresql = (app: Application) => {
  const config = app.get('postgresql')
  const db = knex({
    ...config,
    ...knexSnakeCaseMappers()
  })

  app.set('postgresqlClient', db)
}
