export type ToggleMap = Map<string, IToggleDetails>

export interface IToggleDetails {
    type: string
    fraction: number
    description?: string
    comment?: string
}

export interface IToggle {
    [key: string]: IToggleDetails
}

export interface IToggleDescription {
    'toggles': IToggle
}

export type Toggle = () => boolean
