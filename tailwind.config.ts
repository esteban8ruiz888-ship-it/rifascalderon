import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#0E0C08',
        'fondo-2': '#1A1612',
        'fondo-3': '#2C2518',
        dorado: '#C9A84C',
        'dorado-claro': '#E8C97A',
        'dorado-pale': '#FBF4E3',
        crema: '#FAF6EE',
        muted: '#9E8A60',
      },
    },
  },
  plugins: [],
}

export default config
