export const createTree = (rootObj, children) =>
  ({
    ...rootObj,
    children
  })

export const hasChildren = obj =>
  Array.isArray(obj?.children) && obj.children.length > 0

export const flattenPreorder = tree =>
  hasChildren(tree)
  ? [tree, ...tree.children.flatMap(flattenPreorder)]
  : [tree]
