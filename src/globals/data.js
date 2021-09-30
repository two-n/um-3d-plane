import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

import * as data from '../../data/formattedData.json'
import { colors } from './constants'

const flatData = data.flat()

const xRange = [-500, 500]
const yRange = [20, 160]
const zRange = [500, -500]

const getDomain = (accessor) => extent(flatData.map(d => d[accessor]))

var xScale = scaleLinear()
  .domain(getDomain("x_vals"))
  .range(xRange);

var yScale = scaleLinear()
  .domain(getDomain("y_vals"))
  .range(yRange);

var zScale = scaleLinear()
  .domain(getDomain("z_vals"))
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