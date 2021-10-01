import * as Accenture from '../assets/images/Accenture_logo.png'
import * as Deloitte from '../assets/images/Deloitte_logo.png'
import * as EY from '../assets/images/EY_logo.png'
import * as Google from '../assets/images/Google_Cloud_logo.png'
import * as IBM from '../assets/images/IBM_logo.png'
import * as KPMG from '../assets/images/KPMG_logo.png'

// ASSETS
const colors = {
  "Accenture": "#932AF5",
  "Deloitte": "#90B943",
  "Ernst & Young": "#FBE64D",
  "IBM": "#396FBB",
  "KPMG": "#103081",
  "Google Cloud": "#D85040"
}

const umColors = {
  darkGrey: "rgb(99, 99, 99)",
  lightGrey: "rgb(156, 156, 156)",
  black: "rgb(00,00,00)",
  umRed: "rgb(218, 41, 28)"
}

const images = {
  "Accenture": Accenture,
  "Deloitte": Deloitte,
  "Ernst & Young": EY,
  "IBM": IBM,
  "KPMG": KPMG,
  "Google Cloud": Google
}

// SIZING
const height = window.innerHeight * 0.8
const width = window.innerWidth

// TEXT
const cornerLabels = [
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

const axisLabels = [{
  label: 'WINNING HEARTS',
  rotateX: true,
  coordinates: {
    x: -494,
    y: 1,
    z: -6,
  }
},
{
  label: 'WINNING MINDS',
  rotateZ: true,
  coordinates: {
    x: -6,
    y: 330,
    z: 0,
  }
},
{
  label: 'WINNING WALLETS',
  rotateX: true,
  rotateY: true,
  coordinates: {
    x: -6,
    y: 1,
    z: -290,
  }
},
]

export { images, height, width, cornerLabels, umColors, colors, axisLabels }