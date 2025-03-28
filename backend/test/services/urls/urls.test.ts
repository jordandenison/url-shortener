// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { v4 as uuidv4 } from 'uuid'
import { BadRequest, NotFound } from '@feathersjs/errors'

import { createAndAuthTestUserAndClient } from '../../helpers'
import { app } from '../../../src/app'
import type { Url, UrlData, UrlPatch } from '../../../src/client'

const createdUrls: Url[] = []
const port = 3004
const appUrl = `http://${app.get('host')}:${port}`

describe('urls service', () => {
  before(async () => {
    await app.listen(port)
  })

  after(async () => {
    for (const url of createdUrls) {
      await app.service('urls').remove(url.id)
    }
  })

  it('registered the service', () => {
    const service = app.service('urls')
    assert.ok(service, 'Registered the service')
  })

  it('only returns own URL when getting URLs', async () => {
    const [client1, user1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2, user2] = await createAndAuthTestUserAndClient(appUrl)

    const urlData1: UrlData = {
      value: 'https://example.com/page1',
      slug: `slug_${uuidv4()}`
    }
    const urlData2: UrlData = {
      value: 'https://example.com/page2',
      slug: `slug_${uuidv4()}`
    }
    const createdUrl1 = await client1.service('urls').create(urlData1)
    const createdUrl2 = await client2.service('urls').create(urlData2)
    createdUrls.push(createdUrl1, createdUrl2)

    const fetchedUrl1 = await client1.service('urls').get(createdUrl1.id)
    assert.strictEqual(fetchedUrl1.id, createdUrl1.id)
    assert.strictEqual(fetchedUrl1.userId, user1.id)

    const fetchedUrl2 = await client2.service('urls').get(createdUrl2.id)
    assert.strictEqual(fetchedUrl2.id, createdUrl2.id)
    assert.strictEqual(fetchedUrl2.userId, user2.id)

    try {
      await client1.service('urls').get(createdUrl2.id)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof NotFound)
      assert.strictEqual(error.message, `No record found for id '${createdUrl2.id}'`)
    }

    try {
      await client2.service('urls').get(createdUrl1.id)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof NotFound)
      assert.strictEqual(error.message, `No record found for id '${createdUrl1.id}'`)
    }
  })

  it('only returns own URL when finding URLs', async () => {
    const [client1, user1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2, user2] = await createAndAuthTestUserAndClient(appUrl)

    const urlData1: UrlData = {
      value: 'https://example.com/page3',
      slug: `slug_${uuidv4()}`
    }
    const urlData2: UrlData = {
      value: 'https://example.com/page4',
      slug: `slug_${uuidv4()}`
    }
    const createdUrl1 = await client1.service('urls').create(urlData1)
    const createdUrl2 = await client2.service('urls').create(urlData2)
    createdUrls.push(createdUrl1, createdUrl2)

    const { data: urls1 } = await client1.service('urls').find()
    urls1.forEach((url: Url) => {
      assert.strictEqual(url.userId, user1.id)
    })

    const { data: urls2 } = await client2.service('urls').find()
    urls2.forEach((url: Url) => {
      assert.strictEqual(url.userId, user2.id)
    })

    const { data: queryUrls } = await client1.service('urls').find({ query: { id: createdUrl2.id } })
    assert.strictEqual(queryUrls.length, 0)
  })

  it('allows a user to create a URL with the same value as another user', async () => {
    const [client1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2] = await createAndAuthTestUserAndClient(appUrl)
    const value = 'https://example.com/unique-page'

    const urlData1: UrlData = { value }
    const createdUrl1 = await client1.service('urls').create(urlData1)
    const urlData2: UrlData = { value }
    const createdUrl2 = await client2.service('urls').create(urlData2)
    createdUrls.push(createdUrl1, createdUrl2)

    assert.ok(createdUrl1.id)
    assert.ok(createdUrl2.id)
  })

  it('retries creating a generated slug when the generated slug already exists', async () => {
    app.set('currentSlug', 'aaa')

    const result = await app
      .get('postgresqlClient')
      .raw(`insert into urls (value, slug, user_id, visits, created_at, updated_at) values (?, ?, ?, ?, ?, ?) returning *`, [
        'https://example.com',
        'aab',
        1,
        0,
        new Date().toISOString(),
        new Date().toISOString()
      ])

    createdUrls.push(result.rows[0])

    const [client] = await createAndAuthTestUserAndClient(appUrl)
    const urlData: UrlData = {
      value: 'https://example.com/page5'
    }
    const createdUrl = await client.service('urls').create(urlData)
    createdUrls.push(createdUrl)

    assert.strictEqual(createdUrl.slug, 'aac')
  })

  it('retries multiple times creating a generated slug when the generated slug already exists', async () => {
    app.set('currentSlug', 'baa')

    const intitialSlugs = ['bab', 'bac', 'bad', 'bae', 'baf']

    for (const slug of intitialSlugs) {
      const result = await app
        .get('postgresqlClient')
        .raw(`insert into urls (value, slug, user_id, visits, created_at, updated_at) values (?, ?, ?, ?, ?, ?) returning *`, [
          `https://example.com/${slug}`,
          slug,
          1,
          0,
          new Date().toISOString(),
          new Date().toISOString()
        ])

      createdUrls.push(result.rows[0])
    }

    const [client] = await createAndAuthTestUserAndClient(appUrl)
    const urlData: UrlData = {
      value: 'https://example.com/page5'
    }
    const createdUrl = await client.service('urls').create(urlData)
    createdUrls.push(createdUrl)

    assert.strictEqual(createdUrl.slug, 'bag')
  })

  it('allows users to update only value and slug', async () => {
    const [client, user] = await createAndAuthTestUserAndClient(appUrl)
    const urlData: UrlData = {
      value: 'https://example.com/page6',
      slug: `slug_${uuidv4()}`
    }
    const createdUrl = await client.service('urls').create(urlData)
    createdUrls.push(createdUrl)

    const newValue = 'https://example.com/updated'
    const newSlug = `slug_${uuidv4()}`
    const updatedUrl = await client.service('urls').patch(createdUrl.id, { value: newValue, slug: newSlug } as UrlPatch)
    assert.strictEqual(updatedUrl.value, newValue)
    assert.strictEqual(updatedUrl.slug, newSlug)
    assert.strictEqual(updatedUrl.userId, user.id)
  })

  it('allows a user to remove a URL', async () => {
    const [client] = await createAndAuthTestUserAndClient(appUrl)
    const urlData: UrlData = {
      value: 'https://example.com/page8',
      slug: `slug_${uuidv4()}`
    }
    const createdUrl = await client.service('urls').create(urlData)

    await client.service('urls').remove(createdUrl.id)

    try {
      await client.service('urls').get(createdUrl.id)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof NotFound)
      assert.strictEqual(error.message, `No record found for id '${createdUrl.id}'`)
    }

    const result = await client.service('urls').find({ query: { id: createdUrl.id } })
    assert.strictEqual(result.data.length, 0)
  })

  it('does not allow a user to update to an existing slug', async () => {
    const [client1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2] = await createAndAuthTestUserAndClient(appUrl)

    const urlData1: UrlData = {
      value: 'https://example.com/page17'
    }
    const createdUrl1 = await client1.service('urls').create(urlData1)
    const urlData2: UrlData = {
      value: 'https://example.com/page18'
    }
    const createdUrl2 = await client2.service('urls').create(urlData2)
    createdUrls.push(createdUrl1, createdUrl2)

    try {
      await client1.service('urls').patch(createdUrl1.id, { slug: createdUrl2.slug })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof Error)
      assert.ok(error.message.includes('duplicate key value violates unique constraint'))
    }
  })

  it('does not allow a user to update to an existing value', async () => {
    const [client1] = await createAndAuthTestUserAndClient(appUrl)

    const urlData1: UrlData = {
      value: 'https://example.com/page17'
    }
    const createdUrl1 = await client1.service('urls').create(urlData1)
    const urlData2: UrlData = {
      value: 'https://example.com/page18'
    }
    const createdUrl2 = await client1.service('urls').create(urlData2)
    createdUrls.push(createdUrl1, createdUrl2)

    try {
      await client1.service('urls').patch(createdUrl2.id, { value: urlData1.value })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof Error)
      assert.ok(error.message.includes('duplicate key value violates unique constraint'))
    }
  })

  it("does not allow a user to update another user's URL", async () => {
    const newValue = 'https://example.com/hacked'
    const [client1] = await createAndAuthTestUserAndClient(appUrl)
    const [client2] = await createAndAuthTestUserAndClient(appUrl)

    const urlData: UrlData = {
      value: 'https://example.com/page7',
      slug: `slug_${uuidv4()}`
    }
    const createdUrl = await client2.service('urls').create(urlData)
    createdUrls.push(createdUrl)

    try {
      await client1.service('urls').patch(createdUrl.id, { value: newValue })
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof NotFound)
      assert.strictEqual(error.message, `No record found for id '${createdUrl.id}'`)
    }
  })

  it('does not allow a user to create a duplicate slug', async () => {
    const [client] = await createAndAuthTestUserAndClient(appUrl)
    const duplicateSlug = `slug_${uuidv4()}`

    const urlData1: UrlData = {
      value: 'https://example.com/unique-page',
      slug: duplicateSlug
    }
    const urlData2: UrlData = {
      value: 'https://example.com/another-page',
      slug: duplicateSlug
    }

    const createdUrl = await client.service('urls').create(urlData1)
    createdUrls.push(createdUrl)

    try {
      await client.service('urls').create(urlData2)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof BadRequest)
      assert(error.message.toLowerCase().includes('duplicate key value violates unique constraint'))
    }
  })

  it('does not allow a user to create an invalid slug', async () => {
    const [client] = await createAndAuthTestUserAndClient(appUrl)

    const urlData1: UrlData = {
      value: 'https://example.com/unique-page',
      slug: 'add'
    }
    const urlData2: UrlData = {
      value: 'https://example.com/another-page',
      slug: 'edit'
    }

    try {
      await client.service('urls').create(urlData1)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof BadRequest)
      assert.strictEqual(error.message, 'Invalid slug: add')
    }

    try {
      await client.service('urls').create(urlData2)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof BadRequest)
      assert.strictEqual(error.message, 'Invalid slug: edit')
    }
  })

  it('does not allow a user to create a duplicate url', async () => {
    const [client] = await createAndAuthTestUserAndClient(appUrl)

    const urlData1: UrlData = {
      value: 'https://example.com/unique-page'
    }
    const urlData2: UrlData = {
      value: 'https://example.com/unique-page'
    }

    const createdUrl = await client.service('urls').create(urlData1)
    createdUrls.push(createdUrl)

    try {
      await client.service('urls').create(urlData2)
      assert.fail('Should have thrown an error')
    } catch (error: any) {
      assert(error instanceof BadRequest)
      assert(error.message.toLowerCase().includes('duplicate key value violates unique constraint'))
    }
  })
})
