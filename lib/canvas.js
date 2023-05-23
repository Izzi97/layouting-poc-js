import { compose } from "./functional.js"
import { randomColor } from "./random.js"

const defaults = {
  backgroundColor: randomColor,
  strokeWidth: () => 0,
  strokeColor: () => "black"
}

const createPrimitives = (
  canvasWidth = document.body.clientWidth,
  canvasHeight = document.body.clientHeight
) => {
  const canvas = document.createElement("canvas")
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const context = canvas.getContext("2d")
  
  const fillRect = (instructions) => {
    const {
      x, y,
      width, height,
      backgroundColor = defaults.backgroundColor()
    } = instructions

    context.fillStyle = backgroundColor
    context.fillRect(x, y, width, height)

    return instructions
  }

  const strokeRect = (instructions) => {
    const adjustStroking = ({
      x, y,
      width, height,
      strokeWidth = defaults.strokeWidth(),
      strokeColor = defaults.strokeColor(),
      ...rest
    }) => ({
      ...rest,
      strokeWidth,
      strokeColor,
      x: x + (strokeWidth / 2),
      y: y + (strokeWidth / 2),
      width: width - strokeWidth,
      height: height - strokeWidth
    })

    if (instructions.strokeWidth) {
      const {
        x, y,
        width, height,
        strokeWidth,
        strokeColor
      } = adjustStroking(instructions)

      context.lineWidth = strokeWidth
      context.strokeStyle = strokeColor
      context.strokeRect(x, y, width, height)
    }

    return instructions
  }

  const drawBox = compose(fillRect, strokeRect)

  const clear = () => context.clearRect(0, 0, canvas.width, canvas.height)

  return {canvas, drawBox, clear}
}

export default createPrimitives
