import { Project } from 'theatre'

type TStagger = {
    play: () => void,
	pause: () => void,
    stop: () => void
}

type TStaggerOptions<T> = {
    project: Project,
    elements: Array<T>,
    props: string[],
    onValueChanges: (element: T, values: any) => void,
    modes?: string[] // Fix ME: Write something for modes
    filter?: (element: T) => boolean
}

type TSortFunction<T> = (elements: Array<T>) => number[] | (number[])[]
type TFilterFunction<T> = (element: T, index: number) => boolean