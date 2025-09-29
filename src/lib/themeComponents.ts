// ============================================================================
// THEME USAGE EXAMPLES AND UTILITIES
// ============================================================================
// This file demonstrates how to use the centralized theme system
// for consistent styling and easy theme switching.

import { themeStyles, getThemeClasses, themeVariants } from './theme';

// ============================================================================
// COMPONENT THEME MIXINS
// ============================================================================

export const componentThemes = {
  // Hero Section Theme
  heroSection: {
    container: `${themeStyles.layout.container} ${themeStyles.layout.centered}`,
    background: themeStyles.backgrounds.hero,
    title: themeStyles.text.h1,
    subtitle: themeStyles.text.bodyLarge,
    cta: themeStyles.buttons.primary,
    decorativeBlobs: 'absolute -top-20 -left-20 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-primary-200/20 to-primary-400/10 rounded-full blur-3xl',
  },

  // Service Card Theme
  serviceCard: {
    container: getThemeClasses.card(true),
    icon: getThemeClasses.iconContainer('medium'),
    title: `${themeStyles.text.h3} group-hover:text-primary-700 transition-colors duration-300`,
    description: themeStyles.text.body,
    price: `${themeStyles.text.accent} text-2xl font-bold`,
    features: 'flex items-center gap-2 text-neutral-600',
    featureBullet: 'w-2 h-2 bg-primary-500 rounded-full',
    cta: `${themeStyles.buttons.secondary} w-full`,
  },

  // Blog Post Card Theme
  blogCard: {
    container: getThemeClasses.card(true),
    image: 'relative h-48 overflow-hidden rounded-t-3xl',
    content: 'p-6',
    meta: 'flex items-center text-sm text-neutral-500 mb-3 gap-4',
    title: `${themeStyles.text.h4} group-hover:text-primary-700 transition-colors duration-300 leading-tight`,
    excerpt: `${themeStyles.text.body} mb-4 line-clamp-3`,
    author: 'flex items-center gap-2',
    authorAvatar: 'relative w-8 h-8 rounded-full overflow-hidden',
    readMore: 'w-8 h-8 bg-primary-100 group-hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300',
  },

  // Navigation Theme
  navigation: {
    container: 'bg-white/95 backdrop-blur-sm border-b border-neutral-100/50 sticky top-0 z-50',
    wrapper: themeStyles.layout.container,
    brand: 'flex items-center gap-3',
    logo: 'h-10 w-auto',
    brandText: 'text-xl font-bold text-neutral-900',
    menuItems: 'hidden md:flex items-center space-x-8',
    menuItem: themeStyles.navigation.link,
    mobileButton: 'md:hidden p-2 rounded-lg text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors duration-200',
  },

  // Contact Form Theme
  contactForm: {
    container: 'bg-white rounded-3xl shadow-lg p-8 lg:p-12 border border-neutral-100/50',
    fieldGroup: 'mb-6',
    label: 'block text-sm font-medium text-neutral-700 mb-2',
    input: 'w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200',
    textarea: 'w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none',
    submitButton: `${themeStyles.buttons.primary} w-full py-4`,
    errorText: 'text-red-500 text-sm mt-1',
    successText: 'text-green-500 text-sm mt-1',
  },

  // Footer Theme
  footer: {
    container: 'bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white',
    wrapper: `${themeStyles.layout.container} py-16`,
    section: 'mb-8 lg:mb-0',
    title: 'text-xl font-bold mb-4',
    linkList: 'space-y-3',
    link: 'text-neutral-300 hover:text-white transition-colors duration-200',
    copyright: 'border-t border-neutral-700 pt-8 mt-12 text-center text-neutral-400',
  },

  // CTA Section Theme
  ctaSection: {
    container: 'bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden',
    wrapper: `${themeStyles.layout.container} py-16 relative z-10`,
    content: 'text-center text-white',
    title: 'text-3xl md:text-4xl font-bold mb-4',
    subtitle: 'text-xl text-primary-100 mb-8 max-w-2xl mx-auto',
    button: 'inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-2xl hover:bg-neutral-50 transition-colors font-semibold shadow-lg',
    decorative: 'absolute -top-10 -left-10 w-40 h-40 bg-primary-400/20 rounded-full blur-2xl',
  },
};

// ============================================================================
// THEME SWITCHING UTILITIES
// ============================================================================

/**
 * Generate CSS classes for different theme variants
 * @param variant - Theme variant to use
 * @returns CSS classes string
 */
export function getVariantClasses(variant: keyof typeof themeVariants = 'default') {
  const selectedTheme = themeVariants[variant];
  
  // This would be expanded to support dynamic theme switching
  // For now, it returns the standard classes
  return {
    primary: `${selectedTheme.primary}-600`,
    primaryLight: `${selectedTheme.primary}-100`,
    primaryDark: `${selectedTheme.primary}-700`,
    gradient: `bg-gradient-to-r from-${selectedTheme.primary}-600 to-${selectedTheme.primary}-500`,
  };
}

/**
 * Apply theme variant to a component
 * @param componentTheme - Component theme object
 * @param variant - Theme variant
 * @returns Modified theme with variant applied
 */
export function applyVariant(componentTheme: Record<string, unknown>, variant: keyof typeof themeVariants = 'default') {
  const variantClasses = getVariantClasses(variant);
  
  // Replace primary color references with variant colors
  const modifiedTheme = { ...componentTheme };
  
  Object.keys(modifiedTheme).forEach(key => {
    if (typeof modifiedTheme[key] === 'string') {
      modifiedTheme[key] = modifiedTheme[key]
        .replace(/primary-600/g, variantClasses.primary)
        .replace(/primary-100/g, variantClasses.primaryLight)
        .replace(/primary-700/g, variantClasses.primaryDark);
    }
  });
  
  return modifiedTheme;
}

// ============================================================================
// UTILITY CLASSES GENERATOR
// ============================================================================

/**
 * Generate utility classes for common patterns
 */
export const utilityClasses = {
  // Spacing utilities
  spacing: {
    sectionPadding: 'py-16 lg:py-24',
    containerPadding: 'px-4 sm:px-6 lg:px-8',
    cardPadding: 'p-6 lg:p-8',
  },
  
  // Layout utilities
  layout: {
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    grid2: 'grid md:grid-cols-2 gap-8',
    grid3: 'grid md:grid-cols-2 lg:grid-cols-3 gap-8',
    grid4: 'grid md:grid-cols-2 lg:grid-cols-4 gap-8',
  },
  
  // Animation utilities
  animations: {
    fadeIn: 'opacity-0 animate-fade-in',
    slideUp: 'transform translate-y-4 opacity-0 animate-slide-up',
    scaleIn: 'transform scale-95 opacity-0 animate-scale-in',
    bounce: 'animate-bounce-gentle',
  },
  
  // State utilities
  states: {
    loading: 'opacity-50 pointer-events-none',
    disabled: 'opacity-60 cursor-not-allowed',
    active: 'ring-2 ring-primary-500 ring-opacity-50',
    focus: 'focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 focus:outline-none',
  },
};

// ============================================================================
// THEME CONFIGURATION HELPER
// ============================================================================

/**
 * Create a complete theme configuration for easy switching
 */
export function createThemeConfig(variant: keyof typeof themeVariants = 'default') {
  const selectedVariant = themeVariants[variant];
  
  return {
    name: selectedVariant.name,
    variant,
    colors: {
      primary: selectedVariant.primaryHex,
      primaryClass: `${selectedVariant.primary}-600`,
    },
    components: {
      hero: applyVariant(componentThemes.heroSection, variant),
      card: applyVariant(componentThemes.serviceCard, variant),
      blog: applyVariant(componentThemes.blogCard, variant),
      nav: applyVariant(componentThemes.navigation, variant),
      form: applyVariant(componentThemes.contactForm, variant),
      footer: applyVariant(componentThemes.footer, variant),
      cta: applyVariant(componentThemes.ctaSection, variant),
    },
    utilities: utilityClasses,
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example: Get current theme configuration
export const currentThemeConfig = createThemeConfig('default');

// Example: Get blue theme configuration
export const blueThemeConfig = createThemeConfig('blue');

// Example: Apply theme to a specific component
export const heroWithBlueTheme = applyVariant(componentThemes.heroSection, 'blue');

// ============================================================================
// CSS-IN-JS HELPER (for future implementation)
// ============================================================================

/**
 * Generate CSS-in-JS object from theme classes
 * @param classString - Tailwind class string
 * @returns CSS-in-JS object (for future use with styled-components, emotion, etc.)
 */
export function generateCSSFromClasses(classString: string) {
  // This would convert Tailwind classes to CSS-in-JS
  // For now, it's a placeholder for future implementation
  return {
    className: classString,
    // Future: Convert to actual CSS properties
  };
}

const themeComponentsExport = {
  components: componentThemes,
  variants: themeVariants,
  utilities: utilityClasses,
  createConfig: createThemeConfig,
  applyVariant,
  getVariantClasses,
};

export default themeComponentsExport;
