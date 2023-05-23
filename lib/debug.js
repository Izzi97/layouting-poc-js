export const withLogging = f => input => {
  console.log(input)
  const output = f(input)
  console.log(output)
  return output
}
