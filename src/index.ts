import { NumberPropTypeDescriptor, Timeline } from 'theatre'
import { IPlayOptions, IStaggerOptions, TDefaultSortTypes, TSortFunction } from './types';

const propsArrayToObject = (props: string[]) => {
  const str = `{${props.map((value: string) => `"${value}": { "type": "number" }`)}}`
  return JSON.parse(str) as Record<string, NumberPropTypeDescriptor>;
}

const arrToIndex = (array: any[]): number[] => {
  return array.map((value: any, index: number) => index)
}

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

class TheatreStagger<T> {

  private name: string;
  private mode: string;
  private options: IStaggerOptions<T>
  private originalOptions: IStaggerOptions<T>
  private configProps: Record<string, NumberPropTypeDescriptor>
  private timelines: Timeline[]

  private timeouts: NodeJS.Timeout[] = []

  constructor (name: string, options: IStaggerOptions<T>, mode: string) {
    this.name = name;
    this.mode = mode;
    this.options = options;
    this.originalOptions = Object.assign({}, options);
    const { props, filter } = options;
    let elements = options.elements

    this.configProps = propsArrayToObject(props)

    if (filter) {
      elements = elements.filter(filter)
    }

    this.timelines = elements.map((element: T, index: number) => {
      return this.makeTimeline(element, index);
    })
  }

  public play (options: IPlayOptions = { sort: 'normal', reverse: false, rate: 1, fromBeginning: false }) {
    const sort = options.sort || 'normal'
    const reverse = options.reverse || false
    const rate = options.rate || 1
    const delay = options.delay || 0
    const fromBeginning = options.fromBeginning || false
    const gap = options.gap || 30
    const { elements } = this.options;
    const steps = defaultSortFunctions[sort](elements)
    if (reverse) { steps.reverse() }
    if (fromBeginning) {
      this.clearAllTimeouts()
    }
    steps.forEach((index: number | number[], step: number) => {
      const indexes = (typeof index === 'number') ? [index] : index
      for (const i of indexes) {
        const timeline = this.timelines[i];
        if (fromBeginning) {
          timeline.time = 0;
        }
        this.setTimeout(() => { timeline.play({ rate }) }, delay + (step * gap));
      }
    })
  }

  pause () {
    this.clearAllTimeouts()
  }

  public getMode (mode: string, additionalOptions: Partial<IStaggerOptions<T>> = {}) {
    return createTheatreStagger(
      this.name,
      Object.assign({}, this.originalOptions, additionalOptions),
      mode
    );
  }

  private setTimeout (cb: () => void, time: number) {
    const timeout = setTimeout(() => {
      cb()
    }, time);
    this.timeouts.push(timeout)
  }

  private removeTimeout (timeout: NodeJS.Timeout) {
    console.log(this.timeouts)
    clearTimeout(timeout)
    this.timeouts.splice(this.timeouts.indexOf(timeout), 1)
  }

  private makeTimeline (element: T, index: number) {
    const { project, onValueChanges } = this.options;
    const timeline = project.getTimeline(`${this.name} / ${this.mode}`, `Element ${index}`)
    const theatreObject = timeline.getObject(`Properties`, element, { props: this.configProps })
    theatreObject.onValuesChange((values) => {
      onValueChanges(element, values)
    })
    return timeline;
  }

  private clearAllTimeouts () {
    for (const timeout of this.timeouts) { this.removeTimeout(timeout) }
  }

}



function createTheatreStagger<T = any> (name: string, options: IStaggerOptions<T>, mode: string = 'default'){
  const stagger = new TheatreStagger(name, options, mode)
  console.log(name)
  return stagger;
};

export default createTheatreStagger;
