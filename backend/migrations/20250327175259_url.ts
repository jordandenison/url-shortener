// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('urls', (table) => {
    table.increments('id')

    table.string('value').notNullable().index()
    table.string('slug').notNullable().unique()
    table.integer('userId').notNullable().index()
    table.integer('visits').notNullable().index()

    table.unique(['value', 'userId'])

    table.timestamp('createdAt').notNullable()
    table.timestamp('updatedAt').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('urls')
}
