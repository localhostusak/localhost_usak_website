import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('fetches event types with format field', async () => {
    const eventTypes = await payload.find({
      collection: 'event-types',
      limit: 10,
    })
    expect(eventTypes.docs.length).toBeGreaterThan(0)
    const firstType = eventTypes.docs[0]
    expect(firstType).toHaveProperty('label')
    expect(firstType).toHaveProperty('slug')
    expect(firstType).toHaveProperty('format')
  })

  it('queries latest events by type for template autofill', async () => {
    const eventTypes = await payload.find({
      collection: 'event-types',
      limit: 1,
    })
    const typeId = eventTypes.docs[0].id

    const events = await payload.find({
      collection: 'events',
      where: {
        type: {
          equals: typeId,
        },
      },
      sort: '-createdAt',
      limit: 5,
    })

    expect(events.docs).toBeDefined()
    if (events.docs.length > 0) {
      const latest = events.docs[0]
      expect(latest).toHaveProperty('title')
      expect(latest).toHaveProperty('location')
      expect(latest).toHaveProperty('dateStart')
      expect(latest).toHaveProperty('modality')
      expect(latest).toHaveProperty('format')
    }
  })
})

