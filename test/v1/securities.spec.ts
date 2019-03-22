import { IntrinioV1 } from '../../src/v1'
import * as nock from 'nock'

const BASE_URL = 'https://api.intrinio.com:443'

describe('securities', () => {
  let client = new IntrinioV1.Intrinio({
    version: 'v1',
    token: 'abc'
  })

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

  describe('historicalData', () => {
    test('returns the historical values for a specified identifier and item', async () => {
      const params = {
        identifier: 'AAPL',
        item: 'marketcap'
      }

      const historicalData = [
        {
          date: '2019-03-20',
          value: 898135096320
        },
        {
          date: '2019-03-19',
          value: 890354695560
        },
        {
          date: '2019-03-18',
          value: 897466841040
        }
      ]

      const scope = nock(BASE_URL)
        .get('/historical_data')
        .query({ identifier: params.identifier, item: params.item })
        .reply(200, {
          data: historicalData,
          identifier: 'AAPL',
          item: 'marketcap',
          result_count: 2899,
          page_size: 1000,
          current_page: 1,
          total_pages: 3,
          api_call_credits: 1
        })

      const response = await client.securities.historicalData(
        params.identifier,
        params.item
      )

      expect(response.data).toEqual(historicalData)

      scope.done()
    })
  })
})
