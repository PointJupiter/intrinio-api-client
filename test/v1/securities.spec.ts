import { IntrinioV1 } from '../../src/v1'
import * as nock from 'nock'

const BASE_URL = 'https://api.intrinio.com:443'

describe('securities', () => {
  let client = new IntrinioV1.Intrinio('abc')

  afterEach(() => {
    nock.cleanAll()
  })

  describe('dataPoint', () => {
    test('returns single data point for single identifier', async () => {
      const result = {
        identifier: 'AAPL',
        item: 'adj_close_price',
        value: 188.16
      }
      const scope = nock(BASE_URL)
        .get('/data_point')
        .query({ identifier: result.identifier, item: result.item })
        .reply(200, result)

      const response = await client.securities.dataPoint(
        result.identifier,
        result.item
      )

      expect(response).toEqual(result)

      scope.done()
    })
  })
})
