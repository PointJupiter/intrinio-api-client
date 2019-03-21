import { IntrinioV2 } from '.'
import { PaginationParams, PaginationResponse, ScreeningParams } from './interfaces'

export interface Security {
  /**
   * The Intrinio ID for Security
   */
  id: string
  /**
   * The Intrinio ID for the Company for which the Security is issued
   */
  company_id: string | null
  /**
   * The name of the Security
   */
  name: string
  /**
   * A 2-3 digit code classifying the Security
   */
  code: string | null
  /**
   * The currency in which the Security is traded on the exchange
   */
  currency: string | null
  /**
   * The common/local ticker of the Security
   */
  ticker: string
  /**
   * The country-composite ticker of the Security
   */
  composite_ticker: string
  /**
   * The OpenFIGI identifier
   */
  figi: string
  /**
   * The country-composite OpenFIGI identifier
   */
  composite_figi: string | null
  /**
   * The global-composite OpenFIGI identifier
   */
  share_class_figi: string | null
}

interface AllSecuritiesQueryParams extends PaginationParams {}

interface AllSecuritiesResponse extends PaginationResponse {
  /**
   * Array of securities.
   */
  securities: Security[]
}

export type Omit<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>

interface SearchSecuritiesQueryParams extends Omit<PaginationParams, 'next_page'> {}

interface SearchSecuritiesResponse {
  /**
   * Array of securities.
   */
  securities: Security[],
  /**
   * Gets the next page of data from a previous API call.
   */
  next_page: null
}

interface ScreenSecuritiesQueryParams extends PaginationParams {
  /**
   * Results returned sorted by this column.
   */
  order_column?: string
  /**
   * Sort order to use with the `order_column`.
   */
  order_direction?: 'asc' | 'desc'
  /**
   * Return only primary securities.
   */
  primary_only?: boolean
}

interface ScreenSecurity {
  /**
   * Security matching screen criteria.
   */
  security: Security
  /**
   * Data properties and matching criteria.
   */
  data: {
    /**
     * The data tag field to which the condition applies.
     */
    tag: string
    /**
     * Data tag text value.
     */
    text_value: string | null
    /**
     * Data tag numberical value.
     */
    number_value: number | null
  }
}

type ScreenSecuritiesResponse = ScreenSecurity[]

interface HistoricalDataForSecurityParams extends PaginationParams {
  /**
   * Return historical data in the given frequency.
   */
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  /**
   * Filter by type, when applicable.
   */
  type?: string
  /**
   * Get historical data on or after this date.
   */
  start_date?: string
  /**
   * Get historical date on or before this date.
   */
  end_date?: string
  /**
   * Sort by date `asc` or `desc`.
   */
  sort_order?: 'asc' | 'desc'
}

interface HistoricalDataForSecurityResponse$HistoricalData {
  /**
   * The date that the value is present.
   */
  date: Date
  /**
   * The historical value.
   */
  value: number
}

interface HistoricalDataForSecurityResponse extends PaginationResponse {
  /**
   *
   */
  historical_data: HistoricalDataForSecurityResponse$HistoricalData[]
  /**
   *
   */
  security: Security
}

export class SecurityService {
  constructor (private readonly client: IntrinioV2.Intrinio) {}

  /**
   * Returns all Securities to which you have access.
   *
   * @param params
   */
  async all (params?: AllSecuritiesQueryParams): Promise<AllSecuritiesResponse> {
    return this.client.get('/securities', params)
  }

  /**
   * Searches for Securities matching the text `query`.
   *
   * @param query Filter securities matching this string.
   * @param params Additional request params.
   */
  async search (query: string, params?: SearchSecuritiesQueryParams): Promise<SearchSecuritiesResponse> {
    return this.client.get('/securities/search', { query, ...params })
  }

  /**
   * Screen Securities using complex logic.
   *
   * @param logic The logic to screen with, consisting of operators, clauses, and nested groups.
   *              See screener documentation for details on how to construct conditions.
   * @param params Additional request params.
   */
  async screen (logic: ScreeningParams, params?: ScreenSecuritiesQueryParams): Promise<ScreenSecuritiesResponse> {
    return this.client.post('/securities/screen', logic, params)
  }

  /**
   * Returns historical values for the given `tag` and the Security with the given `identifier`.
   *
   * @param identifier A Security identifier (Ticker, FIGI, ISIN, CUSIP, Intrinio ID).
   * @param tag An Intrinio data tag ID or code-name.
   */
  async historicalData (
    identifier: string,
    tag: string,
    params?: HistoricalDataForSecurityParams
  ): Promise<HistoricalDataForSecurityResponse> {
    return this.client.get(`/securities/${identifier}/historical_data/${tag}`, params)
  }

  /**
   * Returns a numeric value for the given `tag` for the Security with the given `identifier`.
   *
   * @param identifier A Security identifier (Ticker, FIGI, ISIN, CUSIP, Intrinio ID).
   * @param tag An Intrinio data tag ID or code ([reference](https://data.intrinio.com/data-tags)).
   * @returns The latest numeric value for an identifier/item combination.
   */
  async dataPointNumber (identifier: string, tag: string): Promise<number> {
    return this.client.get(`/securities/${identifier}/data_point/${tag}/number`)
  }

  /**
   * Returns a text value for the given `tag` for the Security with the given `identifier`.
   *
   * @param identifier A Security identifier (Ticker, FIGI, ISIN, CUSIP, Intrinio ID).
   * @param tag An Intrinio data tag ID or code ([reference](https://data.intrinio.com/data-tags)).
   * @returns The latest text value for an identifier/item combination.
   */
  async dataPointText (identifier: string, tag: string): Promise<string> {
    return this.client.get(`/securities/${identifier}/data_point/${tag}/text`)
  }
}
