function isDebug(): boolean {
    return (
        process.env.CONFIG_DEBUG === 'true' ||
        process.env.DEBUG === 'true'
    )
}

export type LogFunction = (tags: Array<string>, data?: string | object) => void

export const defaultLogger: LogFunction = (tags: Array<string>, data?: string | object): void => {
    if (tags.includes('error')) {
        if (data !== undefined) {
            console.error(`[${tags.join(',')}]: `, data)
        } else {
            console.error(`[${tags.join(',')}]`)
        }
    } else if (tags.includes('warn')) {
        if (data !== undefined) {
            console.warn(`[${tags.join(',')}]: `, data)
        } else {
            console.warn(`[${tags.join(',')}]`)
        }
    } else if (isDebug()) {
        if (data !== undefined) {
            console.log(`[${tags.join(',')}]: `, data)
        } else {
            console.log(`[${tags.join(',')}]`)
        }
    }
}
