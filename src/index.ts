import { getProject, NumberPropTypeDescriptor, Project, Timeline } from 'theatre'
import {
    $FixMe,
    $IntentionalAny,
    IPlayOptions,
    IStaggerOptions,
    ITheatreStaggerFinalAPI,
    TCreateTheatreStagger,
    TDefaultSortTypes,
    TSortFunction,
} from './types'

const propsArrayToObject = (props: string[]) => {
    const str = `{${props.map((value: string) => `"${value}": { "type": "number" }`)}}`
    return JSON.parse(str) as Record<string, NumberPropTypeDescriptor>
}

const arrToIndex = <T = $IntentionalAny>(array: T[]): number[] => {
    return array.map((value: T, index: number) => index)
}

const GUESSED_TIMELINE_DURATION = 2000

const defaultSortFunctions: Record<TDefaultSortTypes, TSortFunction<$IntentionalAny>> = {
    center: (elements: $IntentionalAny[]) => {
        const steps = []
        const count = elements.length
        for (let i = 0; i < Math.ceil(count / 2); i++) {
            const side = count - (i + 1)
            steps.push(side === i ? [i] : [i, count - (i + 1)])
        }
        return steps.reverse()
    },
    normal: (elements: $IntentionalAny[]) => arrToIndex(elements),
    shuffle: (elements: $IntentionalAny[]) => arrToIndex(elements).sort(() => 0.5 - Math.random()),
}

const DEFAULT_PLAY_OPTIONS: IPlayOptions = {
    delay: 0,
    gap: 30,
    mode: 'continue',
    rate: 1,
    reverse: false,
    sort: 'center',
}

const DEFAULT_STAGGER_OPTIONS: Partial<IStaggerOptions<$IntentionalAny>> = {}

class TheatreStagger<T> {
    public playing: boolean = false

    private name: string
    private mode: string
    private options: IStaggerOptions<T>
    private previousSortingMethod?: IPlayOptions['sort']
    private currentPlayingOptions: IPlayOptions = DEFAULT_PLAY_OPTIONS
    private configProps: Record<string, NumberPropTypeDescriptor>
    private timelines: Timeline[]
    private steps: number[] | number[][] = []
    private currentStep: number = 0

    private timeouts: NodeJS.Timeout[] = []

    constructor(name: string, options: IStaggerOptions<T>, mode: string) {
        this.name = name
        this.mode = mode
        this.options = { ...DEFAULT_STAGGER_OPTIONS, ...options }

        const { filter, middlewares } = this.options
        let { project, elements } = this.options

        const props: string[] = []

        for (const middleware of middlewares) {
            for (const p of middleware.props) {
                if (!props.includes(p)) {
                    props.push(p)
                }
            }
        }

        project = typeof project === 'string' ? getProject(project) : project

        this.configProps = propsArrayToObject(props)

        if (filter) {
            elements = elements.filter(filter)
        }
        this.calculateSteps()

        this.timelines = []
        elements.forEach((element: T, index: number) => {
            const timeline = (project as Project).getTimeline(`${this.name} / ${this.mode}`, `Element ${index}`)
            const theatreObject = timeline.getObject(`Properties`, element, { props: this.configProps })
            theatreObject.onValuesChange((values: $FixMe) => {
                let doneWithMiddlewares = false
                for (const middleware of middlewares) {
                    if (doneWithMiddlewares) {
                        break
                    }
                    doneWithMiddlewares = true
                    middleware.onValueChanges(element, values, () => {
                        doneWithMiddlewares = false
                    })
                }
            })
            this.timelines.push(timeline)
        })
    }

    public play(options: Partial<IPlayOptions> = {}) {
        this.currentPlayingOptions = {
            ...DEFAULT_PLAY_OPTIONS,
            ...options,
        }
        const { reverse, rate, delay, mode, gap } = this.currentPlayingOptions

        this.calculateSteps()
        if (reverse) {
            this.steps.reverse()
        }

        if (mode === 'reset') {
            this.stop()
        }

        this.steps.forEach((index: number | number[], step: number) => {
            const indexes = typeof index === 'number' ? [index] : index
            for (const i of indexes) {
                const timeline = this.timelines[i]
                const timeout = Math.max(0, delay + step * gap - this.time)
                this.setTimeout(() => {
                    this.currentStep = step
                    if (timeline.time < GUESSED_TIMELINE_DURATION) {
                        // FIXME
                        timeline.play({ rate })
                    }
                }, timeout)
            }
        })
        this.playing = true
    }

    public pause() {
        this.clearAllTimeouts()
        this.timelines.forEach(timeline => {
            if (timeline.playing) {
                timeline.pause()
            }
        })
        this.playing = false
    }

    public get duration() {
        const { delay, gap } = this.currentPlayingOptions
        return delay + (this.steps.length - 1) * gap + GUESSED_TIMELINE_DURATION // FIXME;
    }

    public get time() {
        const { delay, gap } = this.currentPlayingOptions
        const stepTime = delay + this.currentStep * gap
        const step = this.steps[this.currentStep]
        const playingTimeline: Timeline = typeof step === 'number' ? this.timelines[step] : this.timelines[step[0]]
        return stepTime + playingTimeline.time
    }

    public set time(value: number) {
        const { delay, gap } = this.currentPlayingOptions
        this.steps.forEach((index: number | number[], step: number) => {
            const indexes = typeof index === 'number' ? [index] : index
            this.currentStep = 0
            for (const i of indexes) {
                const startTime = delay + step * gap
                const timelineTime = Math.max(0, value - startTime)
                this.timelines[i].time = timelineTime
                if (timelineTime > 0) {
                    this.currentStep = step
                }
            }
        })
        this.playing = false
    }

    public stop() {
        this.clearAllTimeouts()
        this.time = 0
        this.playing = false
    }

    private calculateSteps() {
        const { sort } = this.currentPlayingOptions
        if (this.previousSortingMethod === sort) {
            return
        }
        const { elements } = this.options
        if (typeof sort === 'string') {
            this.steps = defaultSortFunctions[sort as TDefaultSortTypes](elements)
            return
        }
        this.previousSortingMethod = sort
        this.steps = sort(elements)
    }

    private setTimeout(cb: () => void, time: number) {
        const timeout = setTimeout(() => {
            cb()
        }, time)
        this.timeouts.push(timeout)
    }

    private removeTimeout(timeout: NodeJS.Timeout) {
        clearTimeout(timeout)
    }

    private clearAllTimeouts() {
        for (const timeout of this.timeouts) {
            this.removeTimeout(timeout)
        }
        this.timeouts = []
    }
}

const createTheatreStagger: TCreateTheatreStagger = (name, options, mode = 'default') => {
    const stagger = new TheatreStagger(name, options, mode)
    const api: ITheatreStaggerFinalAPI = {
        clone: newMode => createTheatreStagger(name, options, newMode),
        pause: () => stagger.pause(),
        play: playOptions => stagger.play(playOptions),
        playing: false,
        stop: () => stagger.stop(),
        time: 0,
    }
    Object.defineProperty(api, 'time', {
        get: () => stagger.time,
        set: (value: number) => (stagger.time = value),
    })
    return api
}

export default createTheatreStagger
