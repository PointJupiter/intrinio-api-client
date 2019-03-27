import { IntrinioV1 } from './v1'
import { IntrinioV2 } from './v2'

export const VERSIONS = {
  'v1': IntrinioV1.Intrinio,
  'v2': IntrinioV2.Intrinio
}

export function intrinio (options: IntrinioV1.Options): IntrinioV1.Intrinio
export function intrinio (options: IntrinioV2.Options): IntrinioV2.Intrinio
export function intrinio<T = IntrinioV1.Intrinio | IntrinioV2.Intrinio> (
  options: IntrinioV1.Options | IntrinioV2.Options
) {
  const version = options.version
  delete options.version
  try {
    const ctr = (VERSIONS as { [key: string]: any })[version]
    const ep = new ctr(options)
    return Object.freeze(ep) as T
  } catch (e) {
    throw new Error(`Unable to create client ("${version}"): ${e.message}`)
  }
}
