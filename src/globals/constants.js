import * as Accenture from '../assets/images/Accenture_logo.png'
import * as Deloitte from '../assets/images/Deloitte_logo.png'
import * as EY from '../assets/images/EY_logo.png'
import * as Google from '../assets/images/Google_Cloud_logo.png'
import * as IBM from '../assets/images/IBM_logo.png'
import * as KPMG from '../assets/images/KPMG_logo.png'
import * as data from '../data/formattedDataUM.json'


const colors = {
  "Accenture": "#932AF5",
  "Deloitte": "#90B943",
  "Ernst & Young": "#FBE64D",
  "IBM": "#396FBB",
  "KPMG": "#103081",
  "Google Cloud": "#D85040"
}

const y_level = 60

// scales
// x: (-50, 50)
// y: (-10%, 10%)

// TODO: make scaling dynamic based on data ranges

const produceCoords = (x, z) => {
  return {
    x: (x * 10) + 500, // account for range and board
    y: y_level, // constand (distance above board)
    z: parseInt(z.substring(0, z.length - 2)) * -50 + 500 // parse percentage and account for board coords
  }
}

const transformedData = data.reduce((acc, [{ name, x_vals, y_vals, year }]) => ({
  ...acc,
  [name]: acc[name] ? {
    ...acc[name],
    coordinates: {
      ...acc[name].coordinates,
      [year]: produceCoords(x_vals, y_vals)
    }
  } : {
      name,
      coordinates: {
        [year]: produceCoords(x_vals, y_vals)
      },
      color: colors[name]
    }
}), {})


const brands = Object.values(transformedData)

var images = {
  "Accenture": Accenture,
  "Deloitte": Deloitte,
  "Ernst & Young": EY,
  "IBM": IBM,
  "KPMG": KPMG,
  "Google Cloud": Google
}


// CONFIG
const dimensions = ({ width: 954, height: 50, depth: 1060 })
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


export { brands, images, dimensions, height, width, pDims, axisLabels, transformedData }