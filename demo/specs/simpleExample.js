const simpleExample = () => ({
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
})

export default simpleExample
