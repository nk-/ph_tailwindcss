/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["**/*.twig"],
  safelist: [{
    pattern: /hljs+/,
  }],
  theme: {
    extend: {
      'colors': {
        'green-pale': 'rgba(54, 110, 122, 0.7)',
        'red-pale': 'rgba(239, 68, 68, 0.7)',
      },
      
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      /*
      translate: {
        'minus-50': '-50%',
      },
      */
      typography: {
        DEFAULT: {
          css: {
            // color: '#333',
            h4: {
              'color': 'rgb(158, 163, 175)',
              'font-weight': '400'
            },
            
            a: {
              color: '#2c5282',
              'font-weight': '300',
              'text-decoration': 'none',
              /*
                '&:hover': {
                color: '#3182ce',
              },*/
            },
          },
        },
      },
      hljs: {
        theme: 'atom-one-dark',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
//     require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwind-highlightjs'),
  ],
};
