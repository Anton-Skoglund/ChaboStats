/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './src/**/*.{html,js,svelte,ts}', // adjust to your source files
  ],
  theme: {
    extend: {
      colors: {
        pri: 'var(--pri)',
        pri2: 'var(--privari)',
        sec: 'var(--sec)',
        sec2: 'var(--secvari)',
        bg: 'var(--bg)',
        card: 'var(--card)',
        err: 'var(--err)',

        onpri: 'var(--onpri)',
        onsec: 'var(--onsec)',
        onbg: 'var(--onbg)',
        oncard: 'var(--oncard)',
        onerr: 'var(--onerr)',
      },
    },
  },
  plugins: [],
};
