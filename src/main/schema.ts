export const toggleSchema: object = {
    type: 'object',
    properties: {
        toggles: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string'
                    },
                    description: {
                        type: 'string'
                    },
                    fraction: {
                        type: 'number',
                        minimum: 0.0,
                        maximum: 1.0
                    },
                    comment: {
                        type: 'string'
                    }
                },
                required: [ 'id', 'fraction' ]
            }
        }
    },
    required: [ 'toggles' ]
}