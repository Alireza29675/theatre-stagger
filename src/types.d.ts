import { Project } from 'theatre'

interface IStagger {
    play: () => void
	pause: () => void
    stop: () => void
}

interface IStaggerOptions<T> {
    project: Project | string
    elements: Array<T>
    props: string[]
    onValueChanges: (element: T, values: any) => void
    filter?: TFilterFunction
}

type TSortFunction<T> = (elements: Array<T>) => number[] | (number[])[]
type TFilterFunction<T> = (element: T, index: number) => boolean

type TDefaultSortTypes = ('normal' | 'shuffle' | 'center')

interface IPlayOptions {
    gap: number
    sort: TDefaultSortTypes | TSortFunction
    reverse: boolean
    rate: number
    delay: number
    mode: ('reset' | 'continue' | 'blend')
}