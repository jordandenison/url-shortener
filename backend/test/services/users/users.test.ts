import assert from 'assert'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { BadRequest, MethodNotAllowed, NotFound } from '@feathersjs/errors'
import rest from '@feathersjs/rest-client'

import { createAndAuthTestUserAndClient } from '../../helpers'
import { app } from '../../../src/app'
import { createClient, type User, type UserPatch } from '../../../src/client'
import { propertiesToStripExternally } from '../../../src/services/users/users.schema'

const createdUsers: User[] = []

const port = 3003
const appUrl = `http://${app.get('host')}:${port}`

describe('users service', () => {
  before(async () => {
    await app.listen(port)
  })

  after(async () => {
    for (const user of createdUsers) {
      await app.service('users').remove(user.id)
    }
  })

  it('registered the service', () => {
    const service = app.service('users')
    assert.ok(service, 'Registered the service')
  })

  it('only returns own user when getting users', async () => {
    const [client1, user1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2, user2] = await createAndAuthTestUserAndClient(appUrl)
    createdUsers.push(user1, user2)

    const fetchedUserInvalid: User & Record<string, unknown> = await client1.service('users').get(user1.id)
    assert.strictEqual(fetchedUserInvalid.id, user1.id)
    for (const property of propertiesToStripExternally) {
      assert.ok(!fetchedUserInvalid[property])
    }

    const fetchedUser1 = await client1.service('users').get(user1.id)
    assert.strictEqual(fetchedUser1.id, user1.id)

    const fetchedUser2 = await client2.service('users').get(user2.id)
    assert.strictEqual(fetchedUser2.id, user2.id)

    try {
      await client1.service('users').get(user2.id)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof NotFound)
      assert.strictEqual(error.message, `No record found for id '${user2.id}'`)
    }

    try {
      await client2.service('users').get(user1.id)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof NotFound)
      assert.strictEqual(error.message, `No record found for id '${user1.id}'`)
    }
  })

  it('only returns own user when finding users', async () => {
    const [client1, user1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2, user2] = await createAndAuthTestUserAndClient(appUrl)
    createdUsers.push(user1, user2)

    const { data: users1 } = await client1.service('users').find()
    assert.strictEqual(users1.length, 1)
    assert.strictEqual(users1[0].id, user1.id)
    for (const property of propertiesToStripExternally) {
      assert.ok(!(users1[0] as User & Record<string, unknown>)[property])
    }

    const { data: users2 } = await client2.service('users').find()
    assert.strictEqual(users2.length, 1)
    assert.strictEqual(users2[0].id, user2.id)

    const { data: users3 } = await client1.service('users').find({ query: { id: user1.id } })
    assert.strictEqual(users3.length, 1)
    assert.strictEqual(users3[0].id, user1.id)

    const { data: users4 } = await client1.service('users').find({ query: { id: user2.id } })
    assert.strictEqual(users4.length, 1)
    assert.strictEqual(users4[0].id, user1.id)
  })

  it('allows anonymous user creation from the frontend', async () => {
    const anonClient = createClient(rest(appUrl).axios(axios))
    const username = `anonUser_${uuidv4()}`
    const password = uuidv4()

    const newUser = await anonClient.service('users').create({ username, password })
    assert.ok(newUser)
    assert.strictEqual(newUser.username, username)

    createdUsers.push(newUser)
  })

  it('allows users to update only their password', async () => {
    const originalUsername = `testUser6_${uuidv4()}`
    const newPassword = `newPass_${uuidv4()}`
    const [client, user] = await createAndAuthTestUserAndClient(appUrl, originalUsername)
    createdUsers.push(user)

    const updatedUser = await client.service('users').patch(user.id, { password: newPassword })
    assert.strictEqual(updatedUser.username, originalUsername)
    assert.ok(!updatedUser.password)

    await client.authenticate({
      strategy: 'local',
      username: originalUsername,
      password: newPassword
    })
  })

  it('does not allow a user to use a password with less than 8 characters', async () => {
    const anonClient = createClient(rest(appUrl).axios(axios))
    const username = `anonUser_${uuidv4()}`
    const password = '1234567'

    try {
      await anonClient.service('users').create({ username, password })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof BadRequest)
      assert.strictEqual(error.data[0].message, 'must NOT have fewer than 8 characters')
    }
  })

  it('does not allow a user to update their password with less than 8 characters', async () => {
    const [client, user] = await createAndAuthTestUserAndClient(appUrl)
    createdUsers.push(user)

    const password = '1234567'

    try {
      await client.service('users').patch(user.id, { password })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof BadRequest)
      assert.strictEqual(error.data[0].message, 'must NOT have fewer than 8 characters')
    }
  })

  it('does not allow users to update their username', async () => {
    const [client, user] = await createAndAuthTestUserAndClient(appUrl)
    createdUsers.push(user)

    try {
      await client.service('users').patch(user.id, { username: 'newusername' } as any) // eslint-disable-line
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof BadRequest)
    }
  })

  it("does not allow a user to update another user's password or username", async () => {
    const newPassword = `newPass_${uuidv4()}`
    const [client1, user1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2, user2] = await createAndAuthTestUserAndClient(appUrl)
    createdUsers.push(user1, user2)

    try {
      await client1.service('users').patch(user2.id, { password: newPassword })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof NotFound)
      assert.strictEqual(error.message, `No record found for id '${user2.id}'`)
    }
  })

  it('throws a MethodNotAllowed error when trying to remove a user', async () => {
    const [client, user] = await createAndAuthTestUserAndClient(appUrl)
    createdUsers.push(user)

    try {
      await client.service('users').remove(user.id)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof MethodNotAllowed)
      assert.strictEqual(error.message, 'Error')
    }
  })
})
