import * as got from 'got'

export interface GlobalOptions {
  token: string
}

export class BaseClient {
  private apiUrl?: string
  private apiToken?: string

  constructor (options: IntrinioClientOptions) {
    this.apiUrl = options.apiUrl
    this.apiToken = options.apiToken
  }

  async get (path: string, query?: QueryArgs, headers?: Headers) {
    const response = await got(path, {
      method: 'GET',
      baseUrl: this.apiUrl,
      query,
      json: true,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        ...headers
      }
    })

    return response.body
  }

  async post (path: string, body?: object, query?: QueryArgs, headers?: Headers) {
    const response = await got(path, {
      method: 'POST',
      baseUrl: this.apiUrl,
      body,
      query,
      json: true,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        ...headers
      }
    })

    return response.body
  }
}

type QueryArgs = string | object
type Headers = { [key: string]: number | string | string[] | undefined }

export interface IntrinioClientOptions {
  apiUrl: string
  apiToken: string
}
