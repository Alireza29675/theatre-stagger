import { getProject } from 'theatre'
import createTheatreStagger from '../../src'

import { TMiddleware } from '../../src/types'
import { getAll } from './grid'

const $ = (q: string) => document.querySelector(q)

const project = getProject('Stagger Example')

const allMyCells = getAll()

const opacityMiddleware: TMiddleware<HTMLDivElement> = {
    onValueChanges: (element, values, next) => {
        const { opacity } = values
        element.style.opacity = opacity
        next()
    },
    props: ['opacity'],
}

const transformMiddleware: TMiddleware<HTMLDivElement> = {
    onValueChanges: (element, values, next) => {
        const { scale, rotation } = values
        element.style.transform = `rotate(${rotation}deg) scale(${scale})`
        next()
    },
    props: ['scale', 'rotation'],
}

const stagger = createTheatreStagger('Test', {
    elements: allMyCells,
    middlewares: [opacityMiddleware, transformMiddleware],
    project,
})

const blink = stagger.clone('Blink')
;(window as any).stagger = stagger
;(window as any).blink = blink
