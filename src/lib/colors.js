/* eslint-disable */
// SINGLE SOURCE OF TRUTH for all colors
// Imported by both theme.ts and tailwind.config.js

let fileTheme = null;
try {
  // Runtime read of the editable theme
  fileTheme = require('../../content/settings/theme.json');
} catch {
  fileTheme = null;
}

const fallback = {
  primary: {
    '50': '#fdf2f8',
    '100': '#fce7f3',
    '200': '#fbcfe8',
    '300': '#f9a8d4',
    '400': '#f472b6',
    '500': '#ec4899',
    '600': '#db2777',
    '700': '#be185d',
    '800': '#9d174d',
    '900': '#831843',
  },

  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    1000: '#000000',
  },

  accent: {
    green: '#10b981',
    blue: '#3b82f6',
    yellow: '#f59e0b',
    red: '#ef4444',
  },
};

function normalizeScale(obj) {
  if (!obj) return {};
  const out = {};
  const shades = ['50','100','200','300','400','500','600','700','800','900'];
  for (const s of shades) {
    const cKey = `c${s}`;
    out[s] = obj[s] || obj[cKey] || undefined;
  }
  return out;
}

const userPrimary = normalizeScale(fileTheme && fileTheme.primary);

const colors = {
  primary: { ...fallback.primary, ...userPrimary },
  neutral: fallback.neutral,
  accent: { ...fallback.accent, ...((fileTheme && fileTheme.accent) || {}) },
};

module.exports = { colors };
