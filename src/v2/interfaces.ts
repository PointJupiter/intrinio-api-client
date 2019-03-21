export interface PaginationParams {
  /**
   * The number of results to return.
   */
  page_size?: number
  /**
   * Gets the next page of data from a previous API call.
   */
  next_page?: string
}

export interface PaginationResponse {
  /**
   * The token required to request the next page of the data.
   */
  next_page: string
}

interface ScreeningParams$Clause {
  /**
   * The data tag field to which the condition applies.
   * For information regarding data tags, view our
   * [data tag reference](https://data.intrinio.com/data-tags).
   */
  field: string
  /**
   * The logical operator for the condition
   */
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains'
  /**
   * The value applied to screen the field by based on the operator.
   */
  value: string
}

interface ScreeningParams$Group {
  /**
   * Specifies the logic to apply between your clause conditions.
   */
  operator: 'AND' | 'OR' | 'NOT'
  /**
   * Array of conditions which the security must meet.
   */
  clauses: ScreeningParams$Clause[]
}

/**
 * The logic to screen with, consisting of operators, clauses, and nested groups.
 * See [screener documentation](https://docs.intrinio.com/documentation/screener_v2)
 * for details on how to construct conditions.
 */
export interface ScreeningParams extends ScreeningParams$Group {
  /**
   * Array of objects each of which contains "operator" and "clauses" properties.
   */
  groups?: ScreeningParams$Group[]
}
