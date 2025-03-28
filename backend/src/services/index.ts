import { url } from './urls/urls'
import { user } from './users/users'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(url)
  app.configure(user)
}
