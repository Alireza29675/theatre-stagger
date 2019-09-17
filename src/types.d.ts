import { Project } from 'theatre'

interface IStagger {
    play: () => void
	pause: () => void
    stop: () => void
}

interface IStaggerOptions<T> {
    project: Project
    elements: Array<T>
    props: string[]
    onValueChanges: (element: T, values: any) => void
    sort?: TDefaultSortTypes
    filter?: TFilterFunction
}

type TSortFunction<T> = (elements: Array<T>) => number[] | (number[])[]
type TFilterFunction<T> = (element: T, index: number) => boolean

type TDefaultSortTypes = ('normal' | 'shuffle' | 'center')

interface IPlayOptions {
    gap?: number
    reverse?: boolean
    rate?: number
    delay?: number
    fromBeginning?: boolean
}