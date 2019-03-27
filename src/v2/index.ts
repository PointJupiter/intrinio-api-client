import { BaseClient, GlobalOptions } from '../base'
import { SecurityService } from './securities'

export namespace IntrinioV2 {
  export interface Options extends GlobalOptions {
    version: 'v2'
  }

  export class Intrinio extends BaseClient {
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
