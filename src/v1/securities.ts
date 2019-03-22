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

  /**
   * Returns the historical data for for a selected `identifier` (ticker symbol or index symbol)
   * for a selected `tag`. Income statement, cash flow statement, and ratios are returned as trailing
   * twelve months values by default, but can be changed with the type parameter. All other historical
   * data points are returned as their value on a certain day based on filings reported as of that date.
   *
   * @param identifier An identifier, which can be a security ticker, SEC CIK ID, FRED Series ID, etc.
   * @param item An item, which can be a data tag or a special code ([reference](https://data.intrinio.com/data-tags)).
   * @param params Additional request params.
   */
  async historicalData (
    identifier: string,
    item: string,
    params?: HistoricalDataForSecurityParams
  ): Promise<HistoricalData> {
    return this.client.get('/historical_data', { identifier, item, params })
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

interface DataPointMulti extends BatchCallResponse {
  data: DataPoint[]
}

type DataPointResponse = DataPoint | DataPointMulti

interface HistoricalData extends BatchCallResponse {
  data: {
    /**
     * The date associated with the value.
     */
    date: string;
    /**
     * The value.
     */
    value: number;
  }[]
  /**
   * An identifier, which can be a security ticker, SEC CIK ID, FRED Series ID, etc.
   */
  identifier: string
  /**
   * An item, which can be a data tag or a special code ([reference](https://data.intrinio.com/data-tags)).
   */
  item: string
  /**
   * Number of results per page.
   */
  page_size: number
  /**
   * Current page.
   */
  current_page: number
  /**
   * Total number of pages.
   */
  total_pages: number
}

interface HistoricalDataForSecurityParams {
  /**
   * The earliest date for which to return data.
   */
  start_date?: string
  /**
   * The latest date for which to return data.
   */
  end_date?: string
  /**
   * The frequency of the historical prices & valuation data.
   */
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  /**
   * The type of historical data to fetch.
   * For financial statements, the type reflects the type of financial statement.
   * For Sector data, the type reflect the aggretation (mean, median, max, min) type of the data.
   */
  type?:
    | 'FY'
    | 'QTR'
    | 'TTM'
    | 'YTD'
    | 'count'
    | 'sum'
    | 'max'
    | '75thpctl'
    | 'mean'
    | 'median'
    | '25thpctl'
    | 'min'
  /**
   * An integer greater than or equal to 1 for specifying the page number for the return values.
   */
  page_number?: number
  /**
   * An integer greater than or equal to 1 for specifying the number of results on each page.
   */
  page_size?: number
}

interface BatchCallResponse {
  /**
   * Number of results returned in response.
   */
  result_count: number
  /**
   * Number of API call credits spent on a call.
   */
  api_call_credits: number
}
