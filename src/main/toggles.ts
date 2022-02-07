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
            defaultLogger(['info', 'toggleMap'], `Remote toggle values have been updated`)
            if (objectMatchesSchema(toggleSchema, toggles)) {
                rawToggles.clear()
                Object.keys(toggles).forEach((key) => {
                    if (toggles[key]) {
                        rawToggles.set(key, toggles[key])
                    }
                })
                resolve(rawToggles)

            } else {
                if (toggles !== undefined) {
                    defaultLogger(['error', 'toggleMap'], `Value of 'toggles' did not match the expected schema`)
                    reject(new Error(`Value of 'toggles' did not match the expected schema`))
                } else {
                    resolve(rawToggles)
                }
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
