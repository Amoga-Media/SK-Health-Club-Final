/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./404.html",
    "./pages/**/*.html",
    "./components/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'sk-bg':       '#0a0a0a',
        'sk-bg2':      '#0d0d0d',
        'sk-bg3':      '#111111',
        'sk-bg4':      '#161616',
        'sk-card':     '#131313',
        'sk-yellow':   '#F5C518',
        'sk-border':   'rgba(255,255,255,0.08)',
        'sk-muted':    'rgba(255,255,255,0.55)',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'satoshi': ['Satoshi', 'sans-serif'],
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
