# Theatre Stagger

Stagger library for Theatre.js

## Usage

First of all, it is needed to give some definitons:

-   **Project** Theatre's project object which is made using `Theatre.getProject(...)`
-   **Element** Non-primitive objects which are going to act inside a stagger
-   **Middleware** Defines which props are going to be used in this stagger and how they effect mentioned elements

```javascript
const stagger = createTheatreStagger('MyStagger', {
    project: MyProject /* Theatre Project */,
    elements: [
        /* Array of elements*/
    ],
    middlewares: [
        /* Array of middlewares */
    ],
})

stagger.play()
```

## How to write a Middleware?

Middlewares will be run in a queue, as you put them in `middlewares` array. Each Middleware can decide whether it is allowed to go through next Middleware or not by calling `next()` function.

> Theatre Stagger Middlewares are similar to [Express Middlewares](https://expressjs.com/en/guide/using-middleware.html) in use.

```javascript
const opacityMiddleware = {
    props: ['opacity'],
    onValueChanges: (element, values, next) => {
        const { opacity } = values
        element.style.opacity = opacity
        next()
    },
}
```
