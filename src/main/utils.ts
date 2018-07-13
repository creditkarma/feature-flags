import * as JsonValidator from 'ajv'

const JSON_VALIDATOR: JsonValidator.Ajv = new JsonValidator()

export function objectMatchesSchema(schema: object, data: any): boolean {
    return JSON_VALIDATOR.validate(schema, data) as boolean
}