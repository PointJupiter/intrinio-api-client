import * as nock from 'nock'
import { intrinio } from '../../src'

const BASE_URL = 'https://api-v2.intrinio.com:443'

describe('securities', () => {
  let client = intrinio({
    version: 'v2',
    token: 'abc'
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('all', () => {
    test('returns list of all securities', async () => {
      const securities = [{
        id: 'sec_agjrgj',
        company_id: 'com_NX6GzO',
        stock_exchange_id: 'sxg_ozMr9y',
        name: 'Apple Inc',
        code: 'EQS',
        currency: 'USD',
        ticker: 'AAPL',
        composite_ticker: 'AAPL:US',
        figi: 'BBG000B9Y5X2',
        composite_figi: 'BBG000B9XRY4',
        share_class_figi: 'BBG001S5N8V8'
      }, {
        id: 'sec_2gBPAz',
        company_id: 'com_ozMRoy',
        stock_exchange_id: 'sxg_ozMr9y',
        name: 'American Express Co.',
        code: 'EQS',
        currency: 'USD',
        ticker: 'AXP',
        composite_ticker: 'AXP:US',
        figi: 'BBG000BCR153',
        composite_figi: 'BBG000BCQZS4',
        share_class_figi: 'BBG001S5P034'
      }]
      const nextPage = 'MzA5OTQ='
      const scope = nock(BASE_URL)
        .get('/securities')
        .reply(200, {
          securities: securities,
          next_page: nextPage
        })

      const response = await client.securities.all()
      expect(response.securities).toEqual(securities)
      expect(response.next_page).toBe(nextPage)

      scope.done()
    })
  })
})
