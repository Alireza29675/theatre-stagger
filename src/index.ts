import { Timeline, NumberPropTypeDescriptor } from 'theatre'
import { TStaggerOptions, TSortFunction, TFilterFunction } from './types';

const propsArrayToObject = (props: string[]) => {
  const str = `{${props.map((value: string) => `"${value}": { "type": "number" }`)}}`
  return JSON.parse(str) as Record<string, NumberPropTypeDescriptor>;
}

type TDefaultSortTypes = ('normal' | 'reverse' | 'shuffle')

const arrToIndex = (array: Array<any>): number[] => {
  return array.map((value: any, index: number) => index)
}

const defaultSortFunctions: Record<TDefaultSortTypes, TSortFunction<any>> = {
  normal: (elements: Array<any>) => arrToIndex(elements),
  reverse: (elements: Array<any>) => arrToIndex(elements).reverse(),
  shuffle: (elements: Array<any>) => arrToIndex(elements).sort(() => .5 - Math.random())
}

class TheatreStagger<T> {

  name: string;
  options: TStaggerOptions<T>
  configProps: Record<string, NumberPropTypeDescriptor>
  timelines: Timeline[]

  constructor (name: string, options: TStaggerOptions<T>) {
    this.name = name;
    this.options = options;
    let { elements, props, filter } = options;

    this.configProps = propsArrayToObject(props)

    if (filter) elements = elements.filter(filter)

    this.timelines = elements.map((element: T, index: number) => {
      return this.makeTimeline(element, index);
    })
  }

  public play (options: { sort: TDefaultSortTypes } = { sort: 'normal' }) {
    const { sort } = options;
    const { elements } = this.options;
    const steps = defaultSortFunctions[sort](elements)
    steps.forEach((index: number | number[], step: number) => {
      const indexes = (typeof index === 'number') ? [index] : index
      for (const i of indexes) {
        setTimeout(() => this.timelines[i].play(), step * 100);
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



function createTheatreStagger<T = any> (name: string, options: TStaggerOptions<T>){
  return new TheatreStagger(name, options)
};

export default createTheatreStagger;
