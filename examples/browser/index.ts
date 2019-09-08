import { getProject } from 'theatre'
import createTheatreStagger from '../../src'

import { getAll } from './grid'

const project = getProject('Stagger Example')

const stagger = createTheatreStagger('MyList', {
    elements: getAll(),
    onValueChanges: (item, values: any) => {
        const element = (item as HTMLElement)
        element.style.transform = `translate(${values.x}px, ${values.y}px)`
        element.style.opacity = values.opacity
    },
    project,
    props: ['x', 'y', 'opacity'],
})

setTimeout(() => {
    stagger.play({ sort: 'normal' })
}, 2000)