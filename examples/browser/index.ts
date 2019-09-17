import { getProject } from 'theatre'
import createTheatreStagger from '../../src'

import { getAll } from './grid'

const project = getProject('Stagger Example')

const allMyDivs = getAll()

const stagger = createTheatreStagger('AriaTest', {
    elements: allMyDivs,
    onValueChanges: (element, values) => {
        const el = (element as HTMLDivElement)
        el.style.transform = `scale(${values.scale}) rotateZ(${values.rotation}deg)`
        el.style.opacity = values.opacity
    },
    project,
    props: ['scale', 'rotation', 'opacity'],
    sort: 'shuffle',
})

const playButton = document.querySelector('button.play')
const pauseButton = document.querySelector('button.pause')
const stopButton = document.querySelector('button.stop')

if (playButton && pauseButton && stopButton) {
    playButton.addEventListener('click', () => {
        stagger.play({ fromBeginning: true })
    })
    pauseButton.addEventListener('click', () => {
        stagger.pause()
    })
    stopButton.addEventListener('click', () => {
        stagger.stop()
    })
}