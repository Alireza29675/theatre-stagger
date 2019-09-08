import { NumberPropTypeDescriptor, Timeline } from 'theatre'
import { IStaggerOptions, TDefaultSortTypes, TSortFunction, IPlayOptions } from './types';

const propsArrayToObject = (props: string[]) => {
  const str = `{${props.map((value: string) => `"${value}": { "type": "number" }`)}}`
  return JSON.parse(str) as Record<string, NumberPropTypeDescriptor>;
}

const arrToIndex = (array: any[]): number[] => {
  return array.map((value: any, index: number) => index)
}

const defaultSortFunctions: Record<TDefaultSortTypes, TSortFunction<any>> = {
  normal: (elements: any[]) => arrToIndex(elements),
  reverse: (elements: any[]) => arrToIndex(elements).reverse(),
  shuffle: (elements: any[]) => arrToIndex(elements).sort(() => .5 - Math.random())
}

class TheatreStagger<T> {

  private name: string;
  private options: IStaggerOptions<T>
  private configProps: Record<string, NumberPropTypeDescriptor>
  private timelines: Timeline[]

  constructor (name: string, options: IStaggerOptions<T>) {
    this.name = name;
    this.options = options;
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

  public play (options: IPlayOptions = { sort: 'normal' }) {
    const { sort } = options;
    const { elements } = this.options;
    const steps = defaultSortFunctions[sort](elements)
    steps.forEach((index: number | number[], step: number) => {
      const indexes = (typeof index === 'number') ? [index] : index
      for (const i of indexes) {
        setTimeout(() => this.timelines[i].play(), step * 10);
      }
    })
  }

  private makeTimeline (element: T, index: number) {
    const { project, onValueChanges } = this.options;
    const timeline = project.getTimeline(`${this.name}`, `Element ${index}`)
    const theatreObject = timeline.getObject(`Properties`, element, { props: this.configProps })
    theatreObject.onValuesChange((values) => {
      onValueChanges(element, values)
    })
    return timeline;
  }

}



function createTheatreStagger<T = any> (name: string, options: IStaggerOptions<T>){
  return new TheatreStagger(name, options)
};

export default createTheatreStagger;
