export type DescMap = Map<string, IToggleDescription>

export interface IToggleDescription {
    id: string
    fraction: number
    description?: string
    comment?: string
}

export type Toggle = () => boolean