const randomByte = () => Math.random() * 255

export const randomColor = () => `rgb(${randomByte()} ${randomByte()} ${randomByte()})`

export const randomInteger = (min = 0, maxExcl) => {
  const minInt = Math.ceil(min)
  const maxExclInt = Math.floor(maxExcl)
  
  return Math.floor(Math.random() * (maxExclInt - minInt) + minInt);
}

export const randomChoice = (...args) =>
  args[randomInteger(0, args.length)]
