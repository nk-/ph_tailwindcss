/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ["**/*.twig"],
  safelist: [{
    pattern: /hljs+/,
  }],
  theme: {
    extend: {
      
      maxWidth: {
        'fit-2': 'calc(100% - 8rem)',
      },
    
      'colors': {
        'green-vivid': 'rgba(163, 230, 53, 1)', 
        'green-pale': 'rgba(54, 110, 122, 0.7)',
        'red-pale': 'rgba(239, 68, 68, 0.7)',
        'gray-code': 'rgba(40, 44, 52, 0.6)',
        'status-messages': 'rgba(20, 82, 66, 0.8)',
        'drupal-blue': 'rgba(0, 156, 222, 1)'
      },
      
           
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'spacing': 'margin, padding',
      },
      
      typography: {
        DEFAULT: {
          css: {
           h4: {
              'color': 'rgb(158, 163, 175)',
              'font-weight': '400',
            },
            em: {
             'font-weight': '300',
            },
            strong: {
              'font-weight': '300',
            },
            img: {
              'border-radius': '0.75rem',
              'box-shadow': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', 
            },
            i: {
              'font-size': '2.5rem',
            },
            a: {
              color: '#2c5282',
              'font-weight': '300',
              'text-decoration': 'none',
              /*'&:hover': {
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
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwind-highlightjs'),
  ],
};
