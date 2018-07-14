import { expect } from 'code'
import * as Lab from 'lab'

import { toggleMap } from '../../main'

export const lab = Lab.script()

const describe = lab.describe
const it = lab.it

describe('ToggleMap', () => {
    it('should return false for toggle set to 0.0', async () => {
        const toggle = await toggleMap('com.creditkarma.featureFlags.AlwaysDisabled')
        expect(toggle()).to.equal(false)
    })

    it('should return true for toggle set to 1.0', async () => {
        const toggle = await toggleMap('com.creditkarma.featureFlags.AlwaysEnabled')
        expect(toggle()).to.equal(true)
    })
})