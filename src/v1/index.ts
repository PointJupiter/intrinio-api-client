import { BaseClient, GlobalOptions } from '../base'
import { SecurityService } from './securities'

export namespace IntrinioV1 {
  export interface Options extends GlobalOptions {
    version: 'v1'
  }

  export class Intrinio extends BaseClient {
    securities: SecurityService

    constructor (options: Options) {
      super({
        apiToken: options.token,
        apiUrl: 'https://api.intrinio.com'
      })

      this.securities = new SecurityService(this)
    }
  }
}
