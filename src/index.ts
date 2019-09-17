import { NumberPropTypeDescriptor, Timeline } from 'theatre'
import { IPlayOptions, IStaggerOptions, TDefaultSortTypes, TSortFunction } from './types';

const propsArrayToObject = (props: string[]) => {
  const str = `{${props.map((value: string) => `"${value}": { "type": "number" }`)}}`
  return JSON.parse(str) as Record<string, NumberPropTypeDescriptor>;
}

const arrToIndex = (array: any[]): number[] => {
  return array.map((value: any, index: number) => index)
}

const GUESSED_TIMELINE_DURATION = 2000;

const defaultSortFunctions: Record<TDefaultSortTypes, TSortFunction<any>> = {
  center: (elements: any[]) => {
    const steps = []
    const count = elements.length;
    for (let i = 0; i < Math.ceil(count / 2); i++) {
      const side = count - (i + 1);
      steps.push(side === i ? [i] : [i, count - (i + 1)])
    }
    return steps.reverse()
  },
  normal: (elements: any[]) => arrToIndex(elements),
  shuffle: (elements: any[]) => arrToIndex(elements).sort(() => .5 - Math.random()),
}

const DEFAULT_PLAY_OPTIONS: IPlayOptions = {
  delay: 0,
  fromBeginning: false,
  gap: 30,
  rate: 1,
  reverse: false,
  sort: 'center',
}

const DEFAULT_STAGGER_OPTIONS: Partial<IStaggerOptions<any>> = {

}

class TheatreStagger<T> {
  
  public playing: boolean = false

  private name: string;
  private mode: string;
  private options: IStaggerOptions<T>
  private originalOptions: IStaggerOptions<T>
  private previousSortingMethod?: IPlayOptions['sort']
  private currentPlayingOptions: IPlayOptions = DEFAULT_PLAY_OPTIONS
  private configProps: Record<string, NumberPropTypeDescriptor>
  private timelines: Timeline[] = []
  private steps: number[] | number[][] = []
  private currentStep: number = 0

  private timeouts: NodeJS.Timeout[] = []

  constructor (name: string, options: IStaggerOptions<T>, mode: string) {
    this.name = name;
    this.mode = mode;
    this.originalOptions = options;
    this.options = {...DEFAULT_STAGGER_OPTIONS, ...options};

    const { props, filter } = this.options;
    let { elements } = this.options

    this.configProps = propsArrayToObject(props)

    if (filter) { elements = elements.filter(filter) }
    this.calculateSteps()

    elements.forEach((element: T, index: number) => this.makeTimeline(element, index))
  }

  public play (options: Partial<IPlayOptions> = {}) {
    this.currentPlayingOptions = {
      ...DEFAULT_PLAY_OPTIONS,
      ...options
    }
    const { reverse, rate, delay, fromBeginning, gap } = this.currentPlayingOptions

    this.calculateSteps()
    if (reverse) {
      this.steps.reverse()
    }

    if (fromBeginning) {
      this.stop()
    };
    
    this.steps.forEach((index: number | number[], step: number) => {
      const indexes = (typeof index === 'number') ? [index] : index
      for (const i of indexes) {
        const timeline = this.timelines[i];
        const timeout = Math.max(0, (delay + (step * gap)) - this.time)
        this.setTimeout(() => {
          this.currentStep = step;
          if (timeline.time < GUESSED_TIMELINE_DURATION) { // FIXME
            timeline.play({ rate })
          }
        }, timeout);
      }
    })
    this.playing = true
  }

  public pause () {
    this.clearAllTimeouts();
    this.timelines.forEach((timeline) => {
      if (timeline.playing) {
        timeline.pause()
      }
    })
    this.playing = false
  }

  public get duration () {
    const { delay, gap } = this.currentPlayingOptions
    return delay + ((this.steps.length - 1) * gap) + GUESSED_TIMELINE_DURATION // FIXME;
  }

  public get time () {
    const { delay, gap } = this.currentPlayingOptions
    const stepTime = delay + (this.currentStep * gap);
    const step = this.steps[this.currentStep]
    const playingTimeline: Timeline = (typeof step === 'number') ? this.timelines[step] : this.timelines[step[0]];
    return stepTime + playingTimeline.time
  }

  public set time (value: number) {
    const { delay, gap } = this.currentPlayingOptions
    this.steps.forEach((index: number | number[], step: number) => {
      const indexes = (typeof index === 'number') ? [index] : index
      this.currentStep = 0
      for (const i of indexes) {
        const startTime = delay + (step * gap);
        const timelineTime = Math.max(0, value - startTime);
        this.timelines[i].time = timelineTime
        if (timelineTime > 0) {
          this.currentStep = step;
        }
      }
    })
    this.playing = false;
  }
  
  public stop () {
    this.clearAllTimeouts()
    this.time = 0;
    this.playing = false;
  }

  private calculateSteps () {
    const { sort } = this.currentPlayingOptions
    if (this.previousSortingMethod === sort) {
      return;
    }
    const { elements } = this.options
    if (typeof sort === 'string') {
      this.steps = defaultSortFunctions[sort as TDefaultSortTypes](elements)
      return;
    }
    this.previousSortingMethod = sort
    this.steps = sort(elements)
  }

  private setTimeout (cb: () => void, time: number) {
    const timeout = setTimeout(() => {
      cb()
    }, time);
    this.timeouts.push(timeout)
  }

  private removeTimeout (timeout: NodeJS.Timeout) {
    clearTimeout(timeout)
  }

  private makeTimeline (element: T, index: number) {
    const { project, onValueChanges } = this.options;
    const timeline = project.getTimeline(`${this.name} / ${this.mode}`, `Element ${index}`)
    const theatreObject = timeline.getObject(`Properties`, element, { props: this.configProps })
    theatreObject.onValuesChange((values) => onValueChanges(element, values))
    this.timelines.push(timeline)
    return timeline;
  }

  private clearAllTimeouts () {
    for (const timeout of this.timeouts) { this.removeTimeout(timeout) }
    this.timeouts = []
  }
}



function createTheatreStagger<T = any> (name: string, options: IStaggerOptions<T>, mode: string = 'default'){
  const stagger = new TheatreStagger(name, options, mode)
  return stagger;
};

export default createTheatreStagger;
