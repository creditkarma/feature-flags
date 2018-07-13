import { config } from '@creditkarma/dynamic-config'
import * as logger from './logger'
import { DEFAULT_TOGGLES_PATH } from './constants'
import { objectMatchesSchema } from './utils'
import { toggleSchema } from './schema'
import {
    DescMap,
    IToggleDescription,
    Toggle,
} from './types'

const rawToggles: DescMap = new Map()

const futureToggles: Promise<DescMap> =
    new Promise((resolve, reject) => {
        config().watch<Array<IToggleDescription>>(DEFAULT_TOGGLES_PATH).onValue((toggles): void => {
            if (objectMatchesSchema(toggleSchema, { toggles })) {
                toggles.forEach((next: IToggleDescription) => {
                    rawToggles.set(next.id, next)
                })

                resolve(Promise.resolve(rawToggles))

            } else {
                logger.error(`Value of 'toggles' should be an array`)
                reject(new Error(`Value of 'toggles' should be an array`))
            }
        })
    })

export function ToggleMap(key: string): Promise<Toggle> {
    return futureToggles.then((map: DescMap) => {
        return () => {
            if (rawToggles.has(key)) {
                const toggleDesc: IToggleDescription = rawToggles.get(key)!
                const randomInt: number = Math.random()
                return (randomInt < toggleDesc.fraction)

            } else {
                logger.warn(`There is no toggle for key[${key}]. Defaults to false`)
                return false
            }
        }
    })
}