import { config } from '@creditkarma/dynamic-config'
import { DEFAULT_TOGGLES_PATH } from './constants'
import { defaultLogger } from './logger'
import { toggleSchema } from './schema'

import {
    IToggleDescription,
    Toggle,
    ToggleMap,
} from './types'

import { memoize, objectMatchesSchema } from './utils'

const rawToggles: ToggleMap = new Map()

const lazyToggles: () => Promise<ToggleMap> = memoize(() => {
    return new Promise((resolve, reject) => {
        config().watch<Array<IToggleDescription>>(DEFAULT_TOGGLES_PATH).onValue((toggles): void => {
            if (objectMatchesSchema(toggleSchema, { toggles })) {
                toggles.forEach((next: IToggleDescription) => {
                    rawToggles.set(next.id, next)
                })

                resolve(Promise.resolve(rawToggles))

            } else {
                defaultLogger(['error', 'toggleMap'], `Value of 'toggles' should be an array`)
                reject(new Error(`Value of 'toggles' should be an array`))
            }
        })
    })
})

export function toggleMap(key: string): Promise<Toggle> {
    return lazyToggles().then((map: ToggleMap) => {
        return () => {
            if (map.has(key)) {
                const toggleDesc: IToggleDescription = map.get(key)!
                const randomInt: number = Math.random()
                return (randomInt < toggleDesc.fraction)

            } else {
                defaultLogger(['warn', 'toggleMap'], `There is no toggle for key[${key}]. Defaults to false`)
                return false
            }
        }
    })
}
