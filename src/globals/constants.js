import * as uber from '../assets/images/uber.png'
import * as grubhub from '../assets/images/grubhub.png'
import * as doordash from '../assets/images/doordash.png'


const brands = [
  {
    coordinates: {
      year_one: {
        x: 150,
        y: 60,
        z: 750,
      },
      year_two: {
        x: 750,
        y: 60,
        z: 150,
      }
    },
    color: "rgb(255, 48, 8)",
    name: 'A'
  },
{
    coordinates: {
      year_one: {
        x: 300,
        y: 60,
        z: 900,
      },
      year_two: {
        x: 900,
        y: 60,
        z: 300,
      }
    },
    color: "rgb(246, 52, 63)",
    name: 'C'
  },
 {
    coordinates: {
      year_one: {
        x: 50,
        y: 60,
        z: 800,
      },
      year_two: {
        x: 800,
        y: 60,
        z: 50,
      },
    },
    color: "rgb(63, 192, 96)",
    name: 'B'

}]

var images = {
  "A": doordash,
  "B": uber,
  "C": grubhub
}


  // CONFIG
  const dimensions = ({width: 954, height: 50, depth: 1060})
  const height = window.innerHeight
  const width = window.innerWidth

  // plane dimensions
  const pDims = {
    x: 0,
    y: 0,
    z: 0,
    w: 1000,
    h: 10,
    d: 1000
  }

  const axisLabels = [
    {
      label: 'GROW & PROTECT',
      coordinates: {
        x: 0,
        y: 80,
        z: 0,
      }
    },
    {
      label: 'POWER BRAND',
      coordinates: {
        x: 800,
        y: 80,
        z: 0,
      }
    },
    {
      label: 'GET KNOWN',
      coordinates: {
        x: 10,
        y: 80,
        z: 1050,
      }
    },
    {
      label: 'REINVIGORATE',
      coordinates: {
        x: 800,
        y: 80,
        z: 1050,
      }
    },

]


export { brands, images, dimensions, height, width, pDims, axisLabels }