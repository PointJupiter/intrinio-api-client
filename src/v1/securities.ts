import { IntrinioV1 } from '.'

export class SecurityService {
  constructor (private readonly client: IntrinioV1.Intrinio) {}

  /**
   * Returns the most recent data point for a selected identifier
   * (ticker symbol, stock market index symbol, CIK ID, etc.) for a selected tag.
   * Income statement, cash flow statement, and ratios are returned as trailing
   * twelve months values. All other data points are returned as their most recent value,
   * either as of the last release financial statement or the most recent reported value.
   *
   * @param identifier An identifier, which can be a security ticker, SEC CIK ID, FRED Series ID, etc.
   * @param item An item, which can be a data tag or a special code ([reference](https://data.intrinio.com/data-tags)).
   */
  async dataPoint (
    identifier: string,
    item: string | string[]
  ): Promise<DataPoint>
  async dataPoint (
    identifier: string[],
    item: string | string[]
  ): Promise<DataPointMulti>
  async dataPoint (
    identifier: string | string[],
    item: string | string[]
  ): Promise<DataPointResponse> {
    if (Array.isArray(identifier)) {
      identifier = identifier.join(',')
    }
    if (Array.isArray(item)) {
      item = item.join(',')
    }
    return this.client.get('/data_point', { identifier, item })
  }
}

interface DataPoint {
  /**
   * An identifier, which can be a security ticker, SEC CIK ID, FRED Series ID, etc.
   */
  identifier: string
  /**
   * An item, which can be a data tag or a special code ([reference](https://data.intrinio.com/data-tags)).
   */
  item: string
  /**
   * The value.
   */
  value: string | number
}

interface DataPointMulti {
  data: DataPoint[]
  result_count: number
  api_call_credits: number
}

type DataPointResponse = DataPoint | DataPointMulti
