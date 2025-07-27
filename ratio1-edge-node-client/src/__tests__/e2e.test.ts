import nock from 'nock'
import createClient from '../index'

describe('Ratio1EdgeNodeClient e2e', () => {
  const cstoreBase = 'http://localhost:31234'
  const r1fsBase = 'http://localhost:31235'
  const client = createClient({ cstoreUrl: cstoreBase, r1fsUrl: r1fsBase })

  afterEach(() => nock.cleanAll())

  it('performs cstore hgetall and r1fs get_status', async () => {
    nock(cstoreBase)
      .post('/hgetall', { hkey: 'mykey' })
      .reply(200, { result: { mykey: {} } })

    nock(r1fsBase)
      .get('/get_status')
      .reply(200, { status: 'ok' })

    const cstoreRes = await client.cstore.hgetall('mykey')
    const r1fsRes = await client.r1fs.getStatus()

    expect(cstoreRes.result).toBeDefined()
    expect(r1fsRes.status).toBe('ok')
  })
})
