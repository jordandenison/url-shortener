import { app } from './src/app'
import { knexSnakeCaseMappers } from 'objection'

const config = app.get('postgresql')

export default {
  ...config,
  ...knexSnakeCaseMappers()
}
