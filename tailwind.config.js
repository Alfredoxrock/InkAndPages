/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Libre Baskerville', 'Georgia', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
        },
        muted: 'var(--muted)',
        border: 'var(--border)',
        paper: 'var(--paper)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            maxWidth: 'none',
            lineHeight: '1.8',
            'h1, h2, h3, h4': {
              fontFamily: 'Libre Baskerville, Georgia, serif',
              fontWeight: '700',
              color: 'var(--foreground)',
            },
            p: {
              marginBottom: '1.5rem',
            },
            blockquote: {
              borderLeftColor: 'var(--accent)',
              color: 'var(--muted)',
            },
            a: {
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: 'var(--accent-light)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}