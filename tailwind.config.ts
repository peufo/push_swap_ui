import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

export default {
    content: [
        './src/**/*.{html,svelte,ts,js}',
        './node_modules/**/fuma/dist/**/*.svelte',
    ],
    darkMode: 'class',
    theme: {
        extend: {},
    },
    plugins: [daisyui, typography],
    daisyui: {
        logs: false,
    },
} satisfies Config
