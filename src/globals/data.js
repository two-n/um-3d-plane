import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

import * as data from '../../data/formattedData.json'
import { colors } from './constants'

const flatData = data.flat()

const xRange = [-500, 500]
const yRange = [0, 500]
const zRange = [500, -500]

// @param accessor: string
// e.g. getDomain("x_vals")
// removed in favor of a constant value (client's request for center to be 100, 100)
// const getDomain = (accessor) => extent(flatData.map(d => d[accessor]))
const domain = [0, 200]

var xScale = scaleLinear()
  .domain(domain)
  .range(xRange);

var yScale = scaleLinear()
  .domain(domain)
  .range(yRange);

var zScale = scaleLinear()
  .domain(domain)
  .range(zRange);

const produceCoords = (x, y, z) => {
  return {
    x: xScale(x),
    y: yScale(y),
    z: zScale(z)
  }
}

const transformedData = flatData.reduce((acc, { name, x_vals, y_vals, z_vals, year }) => ({
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


const brands = Object.values(transformedData)

export { brands }