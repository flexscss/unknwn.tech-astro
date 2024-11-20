/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        primary: '#0047FF',
        secondary: '#163699'
      },
      fontSize: {
        'big-heading': ['68px', {
          lineHeight: '78px'
        }]
      },
      screens: {
        sm: {
          min: '320px',
          max: '1023px'
        },
        md: '768px',
        lg: '1024px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
