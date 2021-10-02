import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

import * as data from '../../data/formattedData.json'
import { colors } from './constants'

// the board is 1000 by 1000 with the center point at 0
const xRange = [-500, 500]
const yRange = [-500, 500] // only show positive part of Y plane
const zRange = [500, -500]

// @param accessor: string
// e.g. getDomain("x_vals")
// removed in favor of a constant value (client's request for center to be 100, 100)
// const getDomain = (accessor) => extent(flatData.map(d => d[accessor]))
const xDomain = [10, 190]
const yDomain = [50, 150]
const zDomain = [50, 150]

var xScale = scaleLinear()
  .domain(xDomain)
  .range(xRange);

var yScale = scaleLinear()
  .domain(yDomain)
  .range(yRange);

var zScale = scaleLinear()
  .domain(zDomain)
  .range(zRange);

const produceCoords = (x, y, z) => {
  return {
    x: xScale(x),
    y: yScale(y),
    z: zScale(z)
  }
}

// produces the following shape
// {
//   "Accenture": {
//     name: "Accenture",
//     coordinates: {
//       previous: {
//         x: 0,
//         y: 0,
//         z: 0
//       },
//       current: {
//         x: 5,
//         y: 5,
//         z: 5
//       }
//     },
//     color: "#fff"
//   },
//  { "KPG": {
//     ...
//   }}
// }

const transformedData = data.flat().reduce((acc, { name, x_vals, y_vals, z_vals, year }) => ({
  ...acc,
  [name]: acc[name] ? {
    ...acc[name],
    coordinates: {
      ...acc[name].coordinates,
      [year]: produceCoords(x_vals, y_vals, z_vals)
    }
  } : {
      name,
      coordinates: {
        [year]: produceCoords(x_vals, y_vals, z_vals)
      },
      color: colors[name]
    }
}), {})

// get array of objects
const brands = Object.values(transformedData)

export { brands }