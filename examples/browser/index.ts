import { getProject } from 'theatre'
import createTheatreStagger from '../../src'

import { getAll } from './grid'

const project = getProject('Stagger Example')

const allMyCells = getAll()

const stagger = createTheatreStagger('AriaTest', {
    elements: allMyCells,
    onValueChanges: (element, values) => {
        const el = (element as HTMLDivElement);
        el.style.transform = `scale(${values.scale}) rotateZ(${values.rotation}deg)`;
        el.style.opacity = values.opacity;
    },
    project,
    props: ['scale', 'rotation', 'opacity']
});

const blink = stagger.clone('Blink');

(window as any).stagger = stagger;
(window as any).blink = blink;