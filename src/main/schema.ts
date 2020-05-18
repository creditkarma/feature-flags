export const toggleSchema: object = {
    type: 'object',
    patternProperties: {
        '^[A-Za-z0-9 -_.]': {
            type: 'object',
            properties: {
                fraction: {
                    type: 'number',
                    minimum: 0.0,
                    maximum: 1.0,
                },
                type: {
                    type: 'string',
                },
            },
            required: [ 'type', 'fraction' ],
        },
    },
}
