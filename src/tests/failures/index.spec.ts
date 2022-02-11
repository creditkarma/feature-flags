import { expect } from '@hapi/code'
import * as Lab from '@hapi/lab'

import { toggleMap } from '../../main'

export const lab = Lab.script()

const describe = lab.describe
const it = lab.it

// separated out to avoid refactoring memoization
describe('ToggleMap Failure', () => {
    it('should return undefined for invalid toggle path', async () => {
        const toggle = await toggleMap('com.creditkarma.featureFlags.NeverSet', 'invalid')
        expect(toggle()).to.equal(false)
    })
})
