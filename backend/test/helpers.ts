import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import rest from '@feathersjs/rest-client'

import { app } from '../src/app'
import type { ClientApplication, User } from '../src/client'
import { createClient } from '../src/client'

export const createAndAuthTestUserAndClient = async (
  appUrl: string,
  username: string = `testUser1_${uuidv4()}`,
  password: string = uuidv4()
): Promise<[ClientApplication, User, string]> => {
  const client = createClient(rest(appUrl).axios(axios))

  const user = await app.service('users').create({
    username,
    password
  })

  const { accessToken } = await client.authenticate({
    strategy: 'local',
    username,
    password
  })

  return [client, user, accessToken]
}
