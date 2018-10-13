import * as JsonValidator from 'ajv'

const JSON_VALIDATOR: JsonValidator.Ajv = new JsonValidator()

export function objectMatchesSchema(schema: object, data: any): boolean {
    return JSON_VALIDATOR.validate(schema, data) as boolean
}

export function memoize<A>(fn: () => A): () => A
export function memoize<A, B>(fn: (a: A) => B): (a: A) => B
export function memoize<A, B, C>(fn: (a: A, b: B) => C): (a: A, b: B) => C
export function memoize(fn: any): any {
    let cachedValue: any

    return (...args: Array<any>): any => {
        if (cachedValue !== undefined) {
            return cachedValue

        } else {
            cachedValue = fn(...args)
            return cachedValue
        }
    }
}
