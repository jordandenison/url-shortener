import { app } from './src/app'
import { knexSnakeCaseMappers } from 'objection'

const config = process.env.NODE_ENV === 'test' ? app.get('postgresqlTest') : app.get('postgresql')

export default {
  ...config,
  ...knexSnakeCaseMappers()
}
