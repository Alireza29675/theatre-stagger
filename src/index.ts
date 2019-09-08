import { Timeline, NumberPropTypeDescriptor } from 'theatre'
import { TStaggerOptions } from './types';

const propsArrayToObject = (props: string[]) => {
  const str = `{${props.map((value: string) => `"${value}": { "type": "number" }`)}}`
  return JSON.parse(str) as Record<string, NumberPropTypeDescriptor>;
}

class TheatreStagger<T> {

  name: string;
  options: TStaggerOptions<T>
  configProps: Record<string, NumberPropTypeDescriptor>
  timelines: Timeline[]

  constructor (name: string, options: TStaggerOptions<T>) {
    this.name = name;
    this.options = options;
    const { elements, props } = options;

    this.configProps = propsArrayToObject(props)
    
    this.timelines = elements.map((element: T, index: number) => {
      return this.makeTimeline(element, index);
    })
  }

  public play () {
    this.timelines.forEach((timeline: Timeline, index: number) => {
      setTimeout(() => timeline.play(), index * 100);
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
