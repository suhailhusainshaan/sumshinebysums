/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/admin/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '2xsm': '375px',
        xsm: '425px',
        '3xl': '2000px',
      },
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
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // Warm amber
          foreground: 'var(--color-warning-foreground)', // Rich dark brown
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          DEFAULT: 'var(--color-error)', // Muted coral
          foreground: 'var(--color-error-foreground)', // white
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
        brand: {
          50: '#EBEFFF',
          100: '#D1DAFF',
          200: '#A3B5FF',
          300: '#7590FF',
          400: '#476BFF',
          500: '#465fff', // This is the exact hex from your CSS
          600: '#394ECC',
          700: '#2D3D99',
          800: '#202C66',
          900: '#131A33',
        },
        gray: {
          dark: '#1A2231',
        },
      },
      fontSize: {
        'title-2xl': ['72px', { lineHeight: '90px' }],
        'title-xl': ['60px', { lineHeight: '72px' }],
        'title-lg': ['48px', { lineHeight: '60px' }],
        'title-md': ['36px', { lineHeight: '44px' }],
        'title-sm': ['30px', { lineHeight: '38px' }],
        'theme-xl': ['20px', { lineHeight: '30px' }],
        'theme-sm': ['14px', { lineHeight: '20px' }],
        'theme-xs': ['12px', { lineHeight: '18px' }],
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
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        spring: 'cubic-bezier(0.34, 1.26, 0.64, 1)',
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(44, 24, 16, 0.08)',
        warm: '0 2px 6px rgba(44, 24, 16, 0.1)',
        'warm-md': '0 4px 12px rgba(44, 24, 16, 0.12)',
        'warm-lg': '0 8px 24px rgba(44, 24, 16, 0.14)',
        'warm-xl': '0 20px 40px -8px rgba(44, 24, 16, 0.16)',
        'theme-xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)', // The fix for your current error
        'theme-sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        'theme-md':
          '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'theme-lg':
          '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        'theme-xl':
          '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
        'focus-ring': '0px 0px 0px 4px rgba(70, 95, 255, 0.12)',
        datepicker: '-5px 0 0 #262d3c, 5px 0 0 #262d3c',
        tooltip:
          '0px 4px 6px -2px rgba(16, 24, 40, 0.05), -8px 0px 20px 8px rgba(16, 24, 40, 0.05)',
        'slider-navigation': '0px 8px 15px 0px rgba(0, 0, 0, 0.05)',
      },
      dropShadow: {
        '4xl': '0 35px 35px rgba(0, 0, 0, 0.25), 0 45px 65px rgba(0, 0, 0, 0.15)',
      },
      zIndex: {
        1: '1',
        9: '9',
        99: '99',
        999: '999',
        9999: '9999',
        99999: '99999',
        999999: '999999',
        header: '1000',
        'cart-preview': '1050',
        'mobile-menu': '1100',
        'search-overlay': '1200',
        modal: '2000',
        toast: '3000',
      },
    },
  },
  plugins: [],
};
