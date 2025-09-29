import React from 'react'
import { cn } from '@/lib/utils'
import { themeStyles } from '@/lib/theme'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return themeStyles.buttons.primary;
      case 'secondary':
        return themeStyles.buttons.secondary;
      case 'ghost':
        return themeStyles.buttons.ghost;
      case 'outline':
        return 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500';
      default:
        return themeStyles.buttons.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'md': return 'px-4 py-2.5 text-base';
      case 'lg': return 'px-6 py-3 text-lg';
      default: return 'px-4 py-2.5 text-base';
    }
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        getVariantStyles(),
        getSizeStyles(),
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
