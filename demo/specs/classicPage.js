const classicPage = () => ({
  orientation: {
    main: "left-to-right",
    cross: "left"
  },
  children: [
    {
      // sidebar
      dimensions: {
        width: {
          amount: {
            fraction: {
              numerator: 1,
              denominator: 6
            }
          },
          unit: "pw"
        }
      }
    },
    {
      // main-container
      dimensions: {
        width: {
          amount: {
            fraction: {
              numerator: 5,
              denominator: 6
            }
          },
          unit: "pw"
        }
      },
      children: [
        {
          // main-topbar
          dimensions: {
            height: {
              amount: {
                fraction: {
                  numerator: 1,
                  denominator: 8
                }
              },
              unit: "ph"
            }
          }
        },
        {
          // main-page
          padding: 50,
          children: [
            {
              // paragraph
              dimensions: {
                height: {
                  amount: {
                    fraction: {
                      numerator: 1,
                      denominator: 4
                    }
                  },
                  unit: "ph"
                }
              }
            },
            {
              // paragraph
              dimensions: {
                height: {
                  amount: {
                    fraction: {
                      numerator: 1,
                      denominator: 4
                    }
                  },
                  unit: "ph"
                }
              }
            },
            {
              // paragraph
              dimensions: {
                height: {
                  amount: {
                    fraction: {
                      numerator: 1,
                      denominator: 4
                    }
                  },
                  unit: "ph"
                }
              }
            },
            {
              // paragraph
              dimensions: {
                height: {
                  amount: {
                    fraction: {
                      numerator: 1,
                      denominator: 4
                    }
                  },
                  unit: "ph"
                }
              }
            },
          ]
        }
      ]
    }
  ]
})

export default classicPage