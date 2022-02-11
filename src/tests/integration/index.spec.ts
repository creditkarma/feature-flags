import { expect } from '@hapi/code'
import * as Lab from '@hapi/lab'

import { KvStore } from '@creditkarma/consul-client'
import { CONSUL_ADDRESS } from './constants'

import { toggleMap } from '../../main'

export const lab = Lab.script()

const describe = lab.describe
const it = lab.it

const consulClient: KvStore = new KvStore([ CONSUL_ADDRESS ])

function delay(time: number = 3000): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

describe('ToggleMap', () => {
    it('should return undefined for toggles that are not set', async () => {
        const toggle = await toggleMap('com.creditkarma.featureFlags.NeverSet')
        expect(toggle()).to.equal(false)
    })

    it('should return false for toggle set to 0.0', async () => {
        const toggle = await toggleMap('com.creditkarma.featureFlags.AlwaysDisabled')
        expect(toggle()).to.equal(false)
    })

    it('should return true for toggle set to 1.0', async () => {
        const toggle = await toggleMap('com.creditkarma.featureFlags.AlwaysEnabled')
        expect(toggle()).to.equal(true)
    })

    it('should respond to toggle removals', async () => {
        await consulClient.set({ path: 'toggles' }, {
            toggles: { },
        })

        await delay()

        const postToggle = await toggleMap('com.creditkarma.featureFlags.AlwaysEnabled')
        expect(postToggle()).to.equal(false)
    })

    it('should respond to dynamic updates', async () => {
        await consulClient.set({ path: 'toggles' }, {
            toggles: {
                'com.creditkarma.featureFlags.AlwaysEnabled' : {
                    description: "It's a feature toggle",
                    fraction: 0,
                    type: 'BOOL',
                },
                'com.creditkarma.featureFlags.AlwaysDisabled' : {
                    description: "It's a feature toggle",
                    fraction: 1.0,
                    type: 'BOOL',
                },
                'com.creditkarma.featureFlags.SometimesDisabled' : {
                    description: "It's a feature toggle",
                    fraction: 0.4,
                    type: 'RAMP',
                },
            },
        })

        await delay()

        const toggle = await toggleMap('com.creditkarma.featureFlags.AlwaysEnabled')
        expect(toggle()).to.equal(false)
    })
})
