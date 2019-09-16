import { getProject } from 'theatre'
import createTheatreStagger from '../../src'

import { getAll } from './grid'

const project = getProject('Stagger Example')

const allMyDivs = getAll()

const stagger = createTheatreStagger('AriaTest', {
    elements: allMyDivs,
    project,
    props: ['scale', 'rotation', 'opacity'],
    onValueChanges: (element, values) => {
        const el = (element as HTMLDivElement)
        el.style.transform = `scale(${values.scale}) rotateZ(${values.rotation}deg)`
        el.style.opacity = values.opacity
    },
})

const playButton = document.querySelector('button.play')
const pauseButton = document.querySelector('button.pause')

if (playButton && pauseButton) {
    playButton.addEventListener('click', () => {
        stagger.play({ sort: 'center', fromBeginning: true })
    })
    pauseButton.addEventListener('click', () => {
        stagger.pause()
    })
}