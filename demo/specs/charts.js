import "../../lib/functional.js"

export const pillarChart = (values, divisionBase = 0.05) =>
  Array.isArray(values) && ({
    orientation: {
      main: "left-to-right",
      cross: "right"
    },
    cosmetics: {
      backgroundColor: "white"
    },
    children: values.map(value => ({
      dimensions: {
        height: {
          amount: {
            float: Number.isFinite(value) ? value : 0
          }
        },
        width: {
          amount: {
            fraction: {
              numerator: 1 - divisionBase,
              denominator: values.length
            },
          },
          unit: "pw"
        }
      },
      cosmetics: {
        strokeWidth: 5
      }
    })).intersperse({
      dimensions: {
        width: {
          amount: {
            fraction: {
              numerator: divisionBase + (divisionBase / (values.length - 1 || Infinity)),
              denominator: values.length
            }
          },
          unit: "pw"
        }
      },
      cosmetics: {
        backgroundColor: "white"
      }
    })
  })
