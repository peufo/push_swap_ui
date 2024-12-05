import forms from '@tailwindcss/forms'
import daisyui from 'daisyui'
import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/**/*.{html,svelte,ts,js}',
        './node_modules/**/fuma/dist/**/*.svelte',
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [forms, daisyui],
    daisyui: {
        logs: false,
    },
} satisfies Config
