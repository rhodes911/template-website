'use client'

import React from 'react'

interface TinaProviderProps {
  children: React.ReactNode
}

const TinaProvider: React.FC<TinaProviderProps> = ({ children }) => {
  // TinaCMS will inject its editing interface automatically
  // when accessing /admin routes via the development server
  return <>{children}</>
}

export default TinaProvider
