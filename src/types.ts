import { Project } from 'theatre'

export type $IntentionalAny = any
export type $FixMe = any
export type $FixMeNow = any

export interface ITheatreStaggerFinalAPI<T> {
    play: (options?: Partial<IPlayOptions<T>>) => void
    pause: () => void
    stop: () => void
    clone: (newMode: string) => ITheatreStaggerFinalAPI<T>
    time: number
    playing: boolean
}

export interface IMiddleware<T = any> {
    name: string
    props: string[]
    onValueChanges: (element: T, values: any, next: () => void) => void
}

export interface IStaggerOptions<T> {
    project: Project | string
    elements: T[]
    middlewares: Array<IMiddleware<T>>
    filter?: TFilterFunction<T>
}

export type TSortFunction<T> = (elements: T[]) => number[] | number[][]
export type TFilterFunction<T> = (element: T, index: number) => boolean

export type TDefaultSortTypes = 'normal' | 'shuffle' | 'center'

export interface IPlayOptions<T = any> {
    gap: number
    sort: TDefaultSortTypes | TSortFunction<T>
    reverse: boolean
    rate: number
    delay: number
    mode: 'reset' | 'continue' | 'blend'
}

export type TCreateTheatreStagger<T = any> = (
    name: string,
    options: IStaggerOptions<T>,
    mode?: string
) => ITheatreStaggerFinalAPI<T>
