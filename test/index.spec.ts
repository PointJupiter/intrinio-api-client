import { intrinio } from '../src'
import { IntrinioV1 } from '../src/v1'
import { IntrinioV2 } from '../src/v2'

describe('client', () => {
  describe('v1', () => {
    test('creates client instance', () => {
      const client = intrinio({
        version: 'v1',
        token: 'abc'
      })

      expect(client).toBeInstanceOf(IntrinioV1.Intrinio)
    })
  })

  describe('v2', () => {
    test('creates client instance', () => {
      const client = intrinio({
        version: 'v2',
        token: 'abc'
      })

      expect(client).toBeInstanceOf(IntrinioV2.Intrinio)
    })
  })
})
