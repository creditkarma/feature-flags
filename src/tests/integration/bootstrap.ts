#!/usr/bin/env node
import { KvStore } from '@creditkarma/consul-client'
import { CONSUL_ADDRESS } from './constants'

process.chdir(__dirname)

setTimeout(() => {
    const consulClient: KvStore = new KvStore([ CONSUL_ADDRESS ])

    Promise.all([
        consulClient.set({ path: 'toggles' }, [
            {
                id: 'com.creditkarma.featureFlags.AlwaysEnabled',
                description: "It's a feature toggle",
                fraction: 1.0,
            },
            {
                id: 'com.creditkarma.featureFlags.AlwaysDisabled',
                description: "It's a feature toggle",
                fraction: 0,
            },
            {
                id: 'com.creditkarma.featureFlags.SometimesDisabled',
                description: "It's a feature toggle",
                fraction: 0.4,
            },
        ]),
    ]).then(
        () => {
            console.log('Done populating mock data')
        },
        (failure: any) => {
            console.log('Error populating mock data: ', failure)
        },
    )
}, 2000)
