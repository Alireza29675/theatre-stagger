import createTheatreStagger from '../../src'
import { getProject } from 'theatre'

const $$ = (q: string) => document.querySelectorAll(q)
const elements = $$('ul > li')

const project = getProject('Stagger Example')

const stagger = createTheatreStagger('MyList', {
    project,
    elements: Array.from(elements),
    props: ['x', 'y', 'opacity'],
    onValueChanges: (item, values: any) => {
        const element = (item as HTMLElement)
        element.style.transform = `translate(${values.x}px, ${values.y}px)`
        element.style.opacity = values.opacity
    }
})

setTimeout(() => {
    stagger.play()
}, 3000)