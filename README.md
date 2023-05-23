# A makeshift/PoC JS-lib for generic layouting (way too bold claim)

## 🦧 What it does
It arranges boxes within other boxes.

To be more specific, it transforms a tree-like description of box-hierarchies into a sequence of generic render-instructions.

These render-instructions are renderer-agnostic and simply describe the absolute positioning of rectangles on a suitable render-surface in terms of their cartesian coordinates and width/height as an ordinary JS-datastructure.
For convenience and demo-purposes, a simple rendering mechanism that targets HTML `<canvas>` elements is available throught the `createPrimitives` function.

## 🕹 How to use it
```
import layout, { createPrimitives } from "./index.js"
// alternatively, you can 'npm link' the package and
// import layout, { createPrimitives } from "@xmaek/layouting-poc"

const { canvas, drawBox } = createPrimitives()
document.body.append(canvas)
// alternatively, you can hook up your own, render-instruction compliant
// rendering primitives here

cons spec = {
  orientation: {
    main: "left-to-right",
    cross: "right"
  },
  padding: {
    left: 50,
    bottom: 120
  },
  children: [
    {
      dimensions: {
        width: {
          amount: {
            fraction: {
              numerator: 1,
              denominator: 3
            }
          },
          unit: "pw"
        },
        height: {
          amount: {
            float: 300
          }
        }
      }
    }
  ]
}

const { error, instructions } = layout(spec)
// only either of both is set depending on execution success

if (error)
  console.error(error)
else
  instructions.map(drawBox)
```

For a deeper dive, have a look at the `./demo` directory.

## 🔍 How it works

Layouting is performed down the specification-tree, ie. from outer to inner boxes.

Dimensions, ie. width and height, can be defined as absolute render-surface values or with respect to the parent-box or the entire viewport but default to the maximum dimensions of the parent-box' content-area after applying padding.

Positioning is performed only automatically – it can not be specified up front.
A parent-box will position its child-boxes one-dimensionally along its main and cross axes of orientation (a bit like CSS flexbox does, but less powerful): child-boxes will be aligned along the main orientation and will be shifted orthogonally according to the cross orientation.

```
                    █
            default orientation
    (main: top-to-bottom, cross: center)
                    █
←┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈█┈┈┈┈┈┈┈width┈┈┈┈┈┈┈┈→
┏━━━━━━━━━━━━━━━━━━━█━━━━━━━━━━━━━━━━━━━━┓   ↑
┃         ↑         █                    ┃   ┊
┃    padding-top    █                    ┃   ┊
┃         ↓         █                    ┃   ┊
┃         ┏┅┅┅┅┅┅┅┅┅█┅┅┅┅┅┅┅┅┅┓          ┃   ┊
┃ padding ┇         █         ┇ padding  ┃   ┊
┃←┈┈┈┈┈┈┈→┇ content █  area   ┇←┈┈┈┈┈┈┈┈→┃ height
┃  left   ┇         █         ┇  right   ┃   ┊
┃         ┗┅┅┅┅┅┅┅┅┅█┅┅┅┅┅┅┅┅┅┛          ┃   ┊
┃                   █         ↑          ┃   ┊
┃                   █    padding-bottom  ┃   ┊
┃                   █         ↓          ┃   ┊
┗━━━━━━━━━━━━━━━━━━━█━━━━━━━━━━━━━━━━━━━━┛   ↓
                    █
                    ▼
```

The default orientation is `main: "top-to-bottom"`, `cross: center`, ie. vertically downwards and horizontally centering on the render-surface.

`Padding` defaults to `0` for all four directions.

Child `dimensions` default to the parent's content dimensions (parent dimensions, if no padding is set).

All `cosmetics` default to `undefined`, but `drawBox` from `createPrimitives` renders colors as random color values in the `rgb([0-255], [0-255], [0-255])`-space for demo purposes (strokes are still not rendered by default, as the `strokeWidth` defaults to `undefined === 0`).

## 🗺 API reference

---

### `layout(spec, rootPosition?, rootDimension?)`

__Description__

Parses a specification tree into a sequence of render instructions.

__Parameters__

`spec`

Recursive tree-like specification of a nested hierarchy of boxes to be layed out on a 2D render-surface.

Expected shape:

```
{
  orientation?: {
    main?: "top-to-bottom" | "right-to-left" | "bottom-to-top" | "left-to-right",
    cross?: "left" | "center" | "right"
  },
  padding?: {
    top?: number,
    right?: number,
    bottom?: number
    left?: number
  }
  dimensions?: {
    width?: {
      amount?: {
        | float: number
        | fraction: {
            numerator: number,
            denominator: number
          }
      },
      unit?: "pw" | "ph" | "vw" | "vh"
    },
    height?: {
      amount?: {
        | float: number
        | fraction: {
            numerator: number,
            denominator: number
          }
      },
      unit?: "pw" | "ph" | "vw" | "vh"
    }
  },
  cosmetics?: {
    backgroundColor?: "rgb([0-255], [0-255], [0-255])" | <html-canvas-parsable-color> | string,
    strokeWidth?: number,
    strokeColor?: "rgb([0-255], [0-255], [0-255])" | <html-canvas-parsable-color> | string
  },
  children?: [Spec]
}
```

`rootPosition`

Position of the top-left (`{x: 0, y: 0}`) corner of the root box specified as absolute 2D cartesian coordinates on the render-surface.

Expected shape:

```
{
  x: number,
  y: number
}
```

Optional, defaults to: `{x: 0, y: 0}`

`rootDimension`

Dimensions of the root box specified in absolute units on the render-surface.

Expected shape:

```
{
  width: number,
  height: number
}
```

optional, defaults to: `{width: 600, height: 400}`

__Returns__

A sequence of render-instructions.

Shape:

```
[
  {
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: "rgb([0-255], [0-255], [0-255])" | <html-canvas-parsable-color> | string,
    strokeWidth: number,
    strokeColor:  "rgb([0-255], [0-255], [0-255])" | <html-canvas-parsable-color> | string
  }
]
```

---

### `createPrimitives(canvasWidth?, canvasHeight?)`

__Description__

Creates web DOM-primitives with which render-instructions can be displayed and cleared.

Currently, only the HTML `<canvas>` element is supported as render-surface.

__Parameters__

`canvasWidth: number`

Absolute width of HTML `<canvas>` element in browser-native coordinates used as render-surface.

Optional, defaults to `document.body.clientWidth`

`canvasHeight: number`

Absolute height of HTML `<canvas>` element in browser-native coordinates used as render-surface.

Optional, defaults to `document.body.clientHeight`

__Returns__

- an HTML `<canvas>` element as render-surface
- a `drawBox` function that displays a single box-render-instruction on the render-surface
- a `clear` function to erase the render-surface

Shape: 

```
{
  canvas: HTMLCanvasElement,
  drawBox: ({
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor?: "rgb([0-255], [0-255], [0-255])" | <html-canvas-parsable-color> | string,
    strokeWidth?: number,
    strokeColor?: "rgb([0-255], [0-255], [0-255])" | <html-canvas-parsable-color> | string
  }) => void,
  clear: () => void
}
```
