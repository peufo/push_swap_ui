import forms from '@tailwindcss/forms'
import daisyui from 'daisyui'
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [forms, daisyui],
  daisyui: {
    logs: false,
  },
} satisfies Config
