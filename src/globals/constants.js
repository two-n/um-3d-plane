import * as Accenture from '../assets/images/Accenture_logo.png'
import * as Deloitte from '../assets/images/Deloitte_logo.png'
import * as EY from '../assets/images/EY_logo.png'
import * as Google from '../assets/images/Google_Cloud_logo.png'
import * as IBM from '../assets/images/IBM_logo.png'
import * as KPMG from '../assets/images/KPMG_logo.png'

const colors = {
  "Accenture": "#932AF5",
  "Deloitte": "#90B943",
  "Ernst & Young": "#FBE64D",
  "IBM": "#396FBB",
  "KPMG": "#103081",
  "Google Cloud": "#D85040"
}

const images = {
  "Accenture": Accenture,
  "Deloitte": Deloitte,
  "Ernst & Young": EY,
  "IBM": IBM,
  "KPMG": KPMG,
  "Google Cloud": Google
}

// CONFIG
const height = window.innerHeight * 0.8
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
      x: -500,
      y: 20,
      z: -500,
    }
  },
  {
    label: 'POWER BRAND',
    coordinates: {
      x: 300,
      y: 20,
      z: -500,
    }
  },
  {
    label: 'GET KNOWN',
    coordinates: {
      x: -500,
      y: 20,
      z: 500,
    }
  },
  {
    label: 'REINVIGORATE',
    coordinates: {
      x: 260,
      y: 20,
      z: 500,
    }
  },

]

export { images, height, width, pDims, axisLabels, colors }