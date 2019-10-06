import { getProject } from 'theatre'
import createTheatreStagger from '../../src'

import { getAll } from './grid'
import { TMiddleware } from '../../src/types'

const $ = (q: string) => document.querySelector(q)

const project = getProject('Stagger Example')

const allMyCells = getAll()

const opacityMiddleware: TMiddleware<HTMLDivElement> = {
    props: ['opacity'],
    onValueChanges: (element, values, next) => {
        const { opacity } = values
        element.style.opacity = opacity
        next()
    },
}

const transformMiddleware: TMiddleware<HTMLDivElement> = {
    props: ['scale', 'rotation'],
    onValueChanges: (element, values, next) => {
        const { scale, rotation } = values
        element.style.transform = `rotate(${rotation}deg) scale(${scale})`
        next()
    },
}

const stagger = createTheatreStagger('AriaTest', {
    project,
    elements: allMyCells,
    middlewares: [opacityMiddleware, transformMiddleware],
})

const blink = stagger.clone('Blink')
;(window as any).stagger = stagger
;(window as any).blink = blink
