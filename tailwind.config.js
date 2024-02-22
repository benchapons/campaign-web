/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  prefix: '',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-head-table': 'linear-gradient(320deg, rgba(175,211,226,0.4) 0%, rgba(25,167,206,0.4) 100%)',
      },
      fontFamily: {
        Sarabun: ['Sarabun'],
        Rampart: ['Rampart One', 'cursive'],
      },
    },
    colors: {
      transparent: 'transparent',
      white: {
        DEFAULT: '#FFF',
        'anti-flash': '#F6F1F1', //main
        ghost: '#f8f9fa',
      },
      black: '#000',
      yellow: {
        DEFAULT: '#FEFF86',
        funny: '#f0c45d',
        warm: '#f2e7cb',
      },
      blue: {
        dark: '#05233b',
        light: '#AFD3E2', //main
        fresh: '#B0DAFF',
        pacific: '#19A7CE', //main
        sea: '#146C94', //main
        steel: '#2C74B3',
        cobalt: '#205295',
        cerulean: '#144272',
        oxford: '#0A2647',
      },
      gray: {
        deep: '#8191a6',
        dim: '#696969',
        DEFAULT: '#808080',
        dark: '#A9A9A9',
        sliver: '#C0C0C0',
        light: '#D3D3D3',
        gainsboro: '#DCDCDC',
        smoke: '#F5F5F5',
      },
      red: {
        DEFAULT: '#D2001A',
        coral: '#ff4040',
        light: '#f0a8a8',
      },
      pink: {
        DEFAULT: '#d9597b',
        light: '#f2bdcb',
      },
      green: {
        forest: '#228b22',
      },
      orange: {
        DEFAULT: '#de8c59',
        light: '#f2c8ae',
      },
    },
  },
  plugins: [],
};
