import createPrimitives from "../lib/canvas.js"
import layout from "../lib/layouting.js"
import { randomChoice, randomInteger } from "../lib/random.js"

import { pillarChart } from "./specs/charts.js"
import classicPage from "./specs/classicPage.js"
import simpleExample from "./specs/simpleExample.js"

const { canvas, drawBox } = createPrimitives()
document.body.append(canvas)

const randomChart = pillarChart(Array.from({length: randomInteger(3, 30)}, _ => randomInteger(0, 1000)))
const webPage = classicPage()
const simple = simpleExample()

const spec = randomChoice(randomChart, webPage, simple)

const rootPosition = undefined
const rootDimensions = {
  width: canvas.width,
  height: canvas.height
}

const { error, instructions } = layout(spec, rootPosition, rootDimensions)

if (error)
  console.error(error)
else
  instructions.map(drawBox)
