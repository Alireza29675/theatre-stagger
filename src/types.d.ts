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
    modes?: string[] // Fix ME: Write something for modes
    filter?: TFilterFunction
}

type TSortFunction<T> = (elements: Array<T>) => number[] | (number[])[]
type TFilterFunction<T> = (element: T, index: number) => boolean

type TDefaultSortTypes = ('normal' | 'reverse' | 'shuffle')

interface IPlayOptions {
    sort: TDefaultSortTypes
}