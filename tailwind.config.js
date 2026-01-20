/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)', // Warm champagne gold
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // Soft rose gold
          foreground: 'var(--color-secondary-foreground)', // Rich dark brown
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // Rich copper
          foreground: 'var(--color-accent-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // Muted coral
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // Subtle cream
          foreground: 'var(--color-muted-foreground)', // Muted brown
        },
        card: {
          DEFAULT: 'var(--color-card)', // Subtle cream
          foreground: 'var(--color-card-foreground)', // Rich dark brown
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // Subtle cream
          foreground: 'var(--color-popover-foreground)', // Rich dark brown
        },
        success: {
          DEFAULT: 'var(--color-success)', // Sage green
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // Warm amber
          foreground: 'var(--color-warning-foreground)', // Rich dark brown
        },
        error: {
          DEFAULT: 'var(--color-error)', // Muted coral
          foreground: 'var(--color-error-foreground)', // white
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        heading: ['Crimson Text', 'serif'],
        body: ['Source Sans 3', 'sans-serif'],
        caption: ['Karla', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'luxe': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring': 'cubic-bezier(0.34, 1.26, 0.64, 1)',
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(44, 24, 16, 0.08)',
        'warm': '0 2px 6px rgba(44, 24, 16, 0.1)',
        'warm-md': '0 4px 12px rgba(44, 24, 16, 0.12)',
        'warm-lg': '0 8px 24px rgba(44, 24, 16, 0.14)',
        'warm-xl': '0 20px 40px -8px rgba(44, 24, 16, 0.16)',
      },
      zIndex: {
        'header': '1000',
        'cart-preview': '1050',
        'mobile-menu': '1100',
        'search-overlay': '1200',
        'modal': '2000',
        'toast': '3000',
      },
    },
  },
  plugins: [],
}