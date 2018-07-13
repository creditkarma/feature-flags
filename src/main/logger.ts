function isDebug(): boolean {
    return (
        process.env.CONFIG_DEBUG === 'true' ||
        process.env.DEBUG === 'true'
    )
}

export const log = (msg: string, data?: any) => {
    if (data !== undefined && isDebug()) {
        console.log(`[feature-flags:info]: ${msg}: `, data)
    } else if (isDebug()) {
        console.log(`[feature-flags:info]: ${msg}`)
    }
}

export const warn = (msg: string, data?: any) => {
    if (data !== undefined && isDebug()) {
        console.warn(`[feature-flags:warn]: ${msg}: `, data)
    } else if (isDebug()) {
        console.warn(`[feature-flags:warn]: ${msg}`)
    }
}

export const error = (msg: string, data?: any) => {
    if (data !== undefined) {
        console.error(`[feature-flags:error]: ${msg}: `, data)
    } else {
        console.error(`[feature-flags:error]: ${msg}`)
    }
}
