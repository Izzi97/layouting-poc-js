export const compose = (...functions) =>
  args => functions.reduce((res, f) => f(res), args)

export const thread = (...initialArgs) => (...functions) =>
  compose(...functions)(...initialArgs)

Array.prototype.intersperse = function(delimiter) {
  return this.flatMap(element => [delimiter, element]).slice(1)
}
