import { getProject } from 'theatre'
import createTheatreStagger from '../../src'

import { getAll } from './grid'

const project = getProject('Stagger Example')

const stagger = createTheatreStagger('MyList', {
    elements: getAll(),
    onValueChanges: (item, values: any) => {
        const element = (item as HTMLElement)
        element.style.transform = `translate3d(0, ${values.y}px, -1px) rotateZ(${values.rotation}deg)`
        element.style.opacity = values.opacity
    },
    project,
    props: ['rotation', 'y', 'opacity'],
})

setTimeout(() => {
    stagger.play({ sort: 'center', reverse: true })
}, 2000)