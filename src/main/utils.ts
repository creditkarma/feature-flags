import * as JsonValidator from 'ajv'

const JSON_VALIDATOR: JsonValidator.Ajv = new JsonValidator()

export function objectMatchesSchema(schema: object, data: any): boolean {
    return JSON_VALIDATOR.validate(schema, data) as boolean
}

export function memoize<T>(fn: () => T): () => T {
    let cachedValue: any = undefined

    return (): T => {
        if (cachedValue !== undefined) {
            return cachedValue

        } else {
            cachedValue = fn()
            return cachedValue
        }
    }
}