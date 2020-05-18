import { config } from '@creditkarma/dynamic-config'
import { DEFAULT_TOGGLES_PATH } from './constants'
import { defaultLogger } from './logger'
import { toggleSchema } from './schema'

import {
    IToggleDescription,
    IToggleDetails,
    Toggle,
    ToggleMap,
} from './types'

import { memoize, objectMatchesSchema } from './utils'

const rawToggles: ToggleMap = new Map()

const lazyToggles: (togglePath: string) => Promise<ToggleMap> = memoize<string, Promise<ToggleMap>>((togglePath: string) => {
    return new Promise((resolve, reject) => {
        config().watch<IToggleDescription>(togglePath).onValue(({toggles}): void => {
            if (objectMatchesSchema(toggleSchema, toggles)) {
                Object.keys(toggles).forEach((key) => {
                    if (toggles[key]) {
                        rawToggles.set(key, toggles[key])
                    }
                })
                resolve(Promise.resolve(rawToggles))

                resolve(Promise.resolve(rawToggles))

            } else {
                defaultLogger(['error', 'toggleMap'], `Value of 'toggles' should be an object`)
                reject(new Error(`Value of 'toggles' should be an object`))
            }
        })
    })
})

const defaultFallbackToggle: IToggleDetails = {
    type: 'BOOL',
    fraction: 0.0,
}
export function toggleMap(key: string, togglePath: string = DEFAULT_TOGGLES_PATH, fallbackToggle: IToggleDetails = defaultFallbackToggle): Promise<Toggle> {
    return lazyToggles(togglePath).then((map: ToggleMap) => {
        return () => {
            const toggleDesc: IToggleDetails = map.get(key) || fallbackToggle
            const randomInt: number = Math.random()
            return (randomInt < toggleDesc.fraction)
        }
    })
}
