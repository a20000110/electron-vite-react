/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        schema: 'hsl(var(--schema-hsl) / <alpha-value>)',
        subtle: 'hsl(var(--background-subtle-hsl) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      width: {
        siderbar: 'var(--sidebar-width)',
        'siderbar-fold': 'var(--sidebar-fold-width)',
        play: 'var(--play-width)',
        navbar: 'var(--navbar-width)',
        view: 'var(--view-width)',
      },
      height: {
        play: 'var(--play-height)',
        navbar: 'var(--navbar-height)',
        sidebar: 'var(--sidebar-height)',
        'menu-block': 'var(--sidebar-menu-height)',
        view: 'var(--view-height)',
      },
      borderColor: {
        primary: 'hsl(var(--border-hsl) / <alpha-value>)',
        'color-primary': 'hsl(var(--primary-hsl) / <alpha-value>)',
      },
      backgroundColor: {
        primary: 'hsl(var(--primary-hsl) / <alpha-value>)',
        schema: 'hsl(var(--schema-hsl) / <alpha-value>)',
        subtle: 'hsl(var(--background-subtle-hsl) / <alpha-value>)',
      },
      ringColor: {
        primary: 'hsl(var(--border-hsl) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [import('tailwindcss-animate')],
}
