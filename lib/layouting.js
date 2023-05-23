import { thread } from "./functional.js"
import { createTree, flattenPreorder, hasChildren } from "./tree.js"



const orientations = {
  main: {
    leftToRight: "left-to-right",
    rightToLeft: "right-to-left",
    topToBottom: "top-to-bottom",
    bottomToTop: "bottom-to-top"
  },
  cross: {
    left: "left",
    center: "center",
    right: "right"
  }
}

const getOrientation = spec => {
  const {
    main = orientations.main.topToBottom,
    cross = orientations.cross.center
  } = spec?.orientation ?? {}

  return {
    main,
    cross
  }
}

const getPadding = spec => {
  const {
    top = 0,
    right = 0,
    bottom = 0,
    left = 0
  } = typeof(spec?.padding) === "number"
    ? {
        top: spec.padding,
        right: spec.padding,
        bottom: spec.padding,
        left: spec.padding
      }
    : spec?.padding ?? {}

  return {
    top,
    right,
    bottom,
    left
  }
}

const getDimensions = (spec) => {
  const {
    width = defaultWidth,
    height = defaultHeight
  } = spec?.dimensions ?? {}

  return {
    width,
    height
  }
}

const calculateRelativeDimensions = (spec, {vWidth, vHeight, pWidth, pHeight}) => {
  const sanitize = (amount, unit, defaultUnit) => {
    const possibleAmount =
      Number.isFinite(amount?.float) ?
        amount?.float :
      Number.isFinite(amount?.fraction?.numerator / amount?.fraction?.denominator) ?
        (amount?.fraction?.numerator / amount?.fraction?.denominator) :
        null

    const sanitizedUnit = ["vw", "vh", "pw", "ph"].includes(unit)
      ? unit
      : "absolute"
    
    return {
      amount: possibleAmount ?? 1,
      unit: possibleAmount ? sanitizedUnit : defaultUnit
    }
  }

  const getWidth = spec => {
    const {
      amount,
      unit
    } = spec?.dimensions?.width ?? {}

    return sanitize(amount, unit, "pw")
  }

  const getHeight = spec => {
    const {
      amount,
      unit
    } = spec?.dimensions?.height ?? {}

    return sanitize(amount, unit, "ph")
  }

  const applyUnit = ({amount, unit}) => {
    switch(unit) {
      case "vw":
        return amount * vWidth
      case "vh":
        return amount * vHeight
      case "pw":
        return amount * pWidth
      case "ph":
        return amount * pHeight
      default: // absolute dimensions
        return amount
    }    
  }
  
  return {
    width: thread(spec)(getWidth, applyUnit),
    height: thread(spec)(getHeight, applyUnit)
  }
}

const getBackgroundColor = spec => spec?.cosmetics?.backgroundColor

const getStroking = spec => {
  const {
    strokeWidth,
    strokeColor
  } = spec?.cosmetics ?? {}

  return {
    strokeWidth,
    strokeColor
  }
}



const addRootDimensions = ({width = 600, height = 400}) => root => ({
  root,
  context: {
    vWidth: width,
    vHeight: height,
    pWidth: width,
    pHeight: height
  }
})

const calculateDimensions = ({root, context: {vWidth, vHeight, pWidth, pHeight}}) => {
  const newRootDimensions = calculateRelativeDimensions(root, {vWidth, vHeight, pWidth, pHeight})

  const calculateChildDimensions = child => {
    const {width, height} = newRootDimensions
    const {top, right, bottom, left} = getPadding(root)
    const context = {
      vWidth,
      vHeight,
      pWidth: width - right - left,
      pHeight: height - top - bottom
    }

    return calculateDimensions({root: child, context})
  }

  const newChildren = hasChildren(root)
    ? root.children.map(calculateChildDimensions)
    : []
  
  const newRoot = {
    ...root,
    dimensions: newRootDimensions
  }

  return createTree(newRoot, newChildren)
}

const addRootPosition = ({x = 0, y = 0}) => (root) => ({
  root,
  rootPosition: {
    x, y
  }
})

const calculatePositions = ({root, rootPosition: {x, y}}) => {
  const contextWithMainPadding = (root) => {
    const {x, y} = root
    const {main} = getOrientation(root)
    const {top, right, bottom, left} = getPadding(root)
    const {width, height} = getDimensions(root)

    switch(main) {
      case orientations.main.rightToLeft:
        return {
          ...root,
          x: x - right,
          width: width - right
        }
      case orientations.main.bottomToTop:
        return {
          ...root,
          y: y - bottom,
          height: height - bottom
        }
      case orientations.main.leftToRight:
        return {
          ...root,
          x: x + left,
          width: width - left
        }
      case orientations.main.topToBottom:
      default:
        return {
          ...root,
          y: y + top,
          height: height - top
        }
    }
  }

  const positionRelative = (contextSpec, contentSpec) => {
    const {x, y} = contextSpec
    const {width: contextWidth, height: contextHeight} = getDimensions(contextSpec)
    const {main, cross} = getOrientation(contextSpec)
    const {top, right, bottom, left} = getPadding(contextSpec) // only for cross: left|right
    const {width: contentWidth, height: contentHeight} = getDimensions(contentSpec)

    switch (main) {
      case orientations.main.leftToRight: {
        return [
          {
            x,
            y: 
              cross === orientations.cross.left
                ? y + top :
              cross === orientations.cross.right
                ? y + contextHeight - bottom - contentHeight
                : y + (contextHeight / 2) - (contentHeight / 2)
          },
          {
            x: x + contentWidth,
            y
          }
        ]
      }
      case orientations.main.rightToLeft: {
        return [
          {
            x: x + contextWidth - contentWidth,
            y:
              cross === orientations.cross.left
                ? y + contextHeight - bottom - contentHeight :
              cross === orientations.cross.right
                ? y + top
                : y + (contextHeight / 2) - (contentHeight / 2)
          },
          {
            x: x - contentWidth,
            y
          }
        ]
      }
      case orientations.main.bottomToTop: {
        return [
          {
            x:   
              cross === orientations.cross.left
                ? x + left:
              cross === orientations.cross.right
                ? x + contextWidth - right -  contentWidth
                : x + (contextWidth / 2) - (contentWidth / 2),
            y: y + contextHeight - contentHeight
          },
          {
            x,
            y: y - contentHeight
          }
        ] 
      }
      case orientations.main.topToBottom:
      default: 
        return [
          {
            x:
              cross === orientations.cross.left
                ? x + contextWidth - right - contentWidth :
              cross === orientations.cross.right
                ? x + left
                : x + (contextWidth / 2) - (contentWidth / 2),
            y: y
          },
          {
            x,
            y: y + contentHeight
          }
        ]
    }
  }

  const positionChild = ({newChildren, context}, child) => {
    const [childPosition, siblingPosition] = positionRelative(context, child)
    const positionedChild = calculatePositions({root: child, rootPosition: childPosition})

    return {
      newChildren: [...newChildren, positionedChild],
      context: {
        ...context,
        ...siblingPosition
      }
    }
  }

  const newRoot = {
    ...root,
    x, y
  }

  const contentContext = contextWithMainPadding(newRoot)
  
  const {newChildren} = hasChildren(root)
    ? root.children.reduce(positionChild, {newChildren: [], context: contentContext})
    : {newChildren: []}
  
  return createTree(newRoot, newChildren)
}

const calculateCosmetics = root => {
  const newRoot = {
    ...root,
    cosmetics: {
      backgroundColor: getBackgroundColor(root),
      ...getStroking(root)
    }
  }

  const newChildren = hasChildren(root)
    ? root.children.map(calculateCosmetics)
    : []
  
  return createTree(newRoot, newChildren)
}

const orderLayers = flattenPreorder

const instructify = (specs) => specs.map(spec => {
  const {
    x, y,
    dimensions: {width, height},
    cosmetics: {backgroundColor, strokeWidth, strokeColor}
  } = spec

  return {x, y, width, height, backgroundColor, strokeWidth, strokeColor}
})



const layout = (spec, rootPosition = {x: 0, y: 0}, rootDimensions = {width: 600, height: 400}) => {
  try {
    const instructions = thread(spec)(
      addRootDimensions(rootDimensions),
      calculateDimensions,
      addRootPosition(rootPosition),
      calculatePositions,
      calculateCosmetics,
      orderLayers,
      instructify
    )

    return {instructions}
  }
  catch (error) {
    return {error}
  }
}

export default layout;
