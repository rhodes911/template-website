// ============================================================================
// CENTRALIZED THEME SYSTEM FOR ELLIE EDWARDS MARKETING
// ============================================================================
// This file contains all design tokens and theme utilities for consistent
// styling across the entire application. Change values here to restyle 
// the entire site instantly.

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

// Import shared colors - SINGLE SOURCE OF TRUTH
import { colors } from './colors.js';

export const theme = {
  colors,
  
  // Typography scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    }
  },
  
  // Common gradients
  gradients: {
    primary: 'bg-gradient-to-r from-neutral-900 via-primary-600 to-neutral-900',
    hero: 'bg-gradient-to-br from-neutral-50 via-white to-primary-50',
    card: 'bg-gradient-to-br from-white to-primary-50',
    accent: 'bg-gradient-to-r from-primary-500 to-primary-600',
  },
  
  // Shadows and effects
  effects: {
    shadow: {
      sm: 'shadow-sm',
      base: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
    blur: 'backdrop-blur-sm',
  }
};

// ============================================================================
// COMPONENT STYLE PATTERNS
// ============================================================================

export const themeStyles = {
  // Background patterns used throughout the site
  backgrounds: {
    page: 'bg-gradient-to-br from-white via-primary-50/10 to-neutral-50/30',
    hero: 'bg-gradient-to-br from-primary-50/30 via-white to-neutral-50/50',
    card: 'bg-white',
    section: 'bg-gradient-to-br from-neutral-50/50 via-white to-primary-50/30',
  interactive: 'bg-gradient-to-br from-primary-50/50 via-white to-neutral-50/30',
  ctaDark: 'bg-neutral-900 text-white',
  },
  
  // Button styles
  buttons: {
    primary: 'inline-flex items-center justify-center px-6 sm:px-8 py-3 font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md',
    secondary: 'inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 font-semibold bg-white border-2 border-neutral-300 text-neutral-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md',
    ghost: 'inline-flex items-center justify-center px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50/30 rounded-lg transition-all duration-300',
  },
  
  // Card styles
  cards: {
    default: 'bg-white rounded-3xl shadow-lg border border-neutral-100/50 transition-all duration-300',
    hover: 'hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]',
    interactive: 'cursor-pointer group',
  },
  
  // Text styles
  text: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900',
    h2: 'text-3xl md:text-4xl font-bold text-neutral-900',
    h3: 'text-2xl md:text-3xl font-bold text-neutral-900',
    h4: 'text-xl md:text-2xl font-bold text-neutral-900',
    body: 'text-neutral-600 leading-relaxed',
    bodyLarge: 'text-lg md:text-xl text-neutral-600 leading-relaxed',
    accent: 'text-primary-600',
    muted: 'text-neutral-500',
    link: 'text-primary-600 hover:text-primary-700 transition-all duration-300',
  gradientAccent: 'bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent',
  },
  
  // Layout containers
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-16 lg:py-24',
    narrow: 'max-w-4xl mx-auto',
    centered: 'text-center',
  },
  
  // Icon containers
  icons: {
    small: 'w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white',
    medium: 'w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white',
    large: 'w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center text-white',
  },
  
  // Navigation styles
  navigation: {
    link: 'text-neutral-700 hover:text-primary-600 font-medium transition-colors duration-200',
    activeLink: 'text-primary-600',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getThemeClasses = {
  page: () => themeStyles.backgrounds.page,
  hero: () => `${themeStyles.backgrounds.hero} relative overflow-hidden`,
  card: (interactive = false) => {
    const baseClasses = themeStyles.cards.default;
    const interactiveClasses = interactive ? `${themeStyles.cards.interactive} ${themeStyles.cards.hover}` : '';
    return `${baseClasses} ${interactiveClasses}`.trim();
  },
  button: (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => themeStyles.buttons[variant],
  container: () => `${themeStyles.layout.container} ${themeStyles.layout.section}`,
  iconContainer: (size: 'small' | 'medium' | 'large' = 'medium') => themeStyles.icons[size],
};

// ============================================================================
// THEME VARIANTS FOR EASY SWITCHING
// ============================================================================

export const themeVariants = {
  default: { name: 'Bright Orange', primary: 'orange', primaryHex: '#ea580c' },
  blue: { name: 'Blue', primary: 'blue', primaryHex: '#3b82f6' },
  green: { name: 'Green', primary: 'emerald', primaryHex: '#10b981' },
  purple: { name: 'Purple', primary: 'purple', primaryHex: '#8b5cf6' },
  pink: { name: 'Pink/Rose', primary: 'pink', primaryHex: '#db2777' },
};

export const currentTheme = themeVariants.default;

// ============================================================================
// CSS VARIABLES GENERATION
// ============================================================================

export const generateCSSVariables = () => `
  :root {
    --color-primary: ${theme.colors.primary[500]};
    --color-primary-light: ${theme.colors.primary[400]};
    --color-primary-dark: ${theme.colors.primary[600]};
    --color-neutral: ${theme.colors.neutral[900]};
    --color-neutral-light: ${theme.colors.neutral[100]};
    --color-background: ${theme.colors.neutral[0]};
    --color-text: ${theme.colors.neutral[900]};
    --color-text-muted: ${theme.colors.neutral[600]};
  }
`;

// Export everything as a named bundle to satisfy lint rules
export const themeBundle = {
  theme,
  styles: themeStyles,
  classes: getThemeClasses,
  variants: themeVariants,
  current: currentTheme,
  generateCSS: generateCSSVariables,
};

export default themeBundle;
