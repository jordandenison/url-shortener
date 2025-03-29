import { Ajv, addFormats } from '@feathersjs/schema'
import type { FormatsPluginOptions } from '@feathersjs/schema'

const formats: FormatsPluginOptions = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex'
]

const createAjvWithStrictUri = (options?: ConstructorParameters<typeof Ajv>[0]) => {
  const ajv = new Ajv(options)

  ajv.addFormat('strict-uri', {
    type: 'string',
    validate: (data: string) => {
      try {
        const url = new URL(data)
        return ['http:', 'https:'].includes(url.protocol)
      } catch {
        return false
      }
    }
  })

  return addFormats(ajv, formats)
}

export const dataValidator = createAjvWithStrictUri()
export const queryValidator = createAjvWithStrictUri({ coerceTypes: true })
