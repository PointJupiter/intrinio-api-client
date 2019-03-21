import { HttpClient } from '..'
import { SecurityService } from './securities'

export namespace IntrinioV2 {
  export class Intrinio extends HttpClient {
    securities: SecurityService

    constructor (token: string) {
      super({
        apiToken: token,
        apiUrl: 'https://api-v2.intrinio.com'
      })

      this.securities = new SecurityService(this)
    }
  }
}
