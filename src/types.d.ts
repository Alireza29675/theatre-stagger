import { Project } from 'theatre'

interface IStagger {
    play: () => void,
	pause: () => void,
    stop: () => void
}

interface IStaggerOptions<T> {
    project: Project,
    elements: Array<T>,
    props: string[],
    onValueChanges: (element: T, values: any) => void,
    filter?: TFilterFunction
}

type TSortFunction<T> = (elements: Array<T>) => number[] | (number[])[]
type TFilterFunction<T> = (element: T, index: number) => boolean

type TDefaultSortTypes = ('normal' | 'shuffle' | 'center')

interface IPlayOptions {
    sort?: TDefaultSortTypes
    reverse?: boolean
    rate?: number
}