export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#02B7B7',
        },
        secondary: {
          DEFAULT: '#FFC31F',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        xs: '0.8rem',
        sm: '1rem',
        base: '1.3rem',
        md: '1.75rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '3.5rem',
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [],
};
