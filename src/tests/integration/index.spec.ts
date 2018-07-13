import { expect } from 'code'
import * as Lab from 'lab'

import { ToggleMap } from '../../main'

export const lab = Lab.script()

const describe = lab.describe
const it = lab.it

describe('ToggleMap', () => {
    it('should return false for toggle set to 0.0', async () => {
        const toggle = await ToggleMap('com.creditkarma.featureFlags.AlwaysDisabled')
        expect(toggle()).to.equal(false)
    })

    it('should return true for toggle set to 1.0', async () => {
        const toggle = await ToggleMap('com.creditkarma.featureFlags.AlwaysEnabled')
        expect(toggle()).to.equal(true)
    })
})