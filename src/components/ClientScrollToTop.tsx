'use client';

import { useEffect } from 'react';

export default function ClientScrollToTop() {
  useEffect(() => {
    // Only scroll to top if there's no hash in the URL
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null; // This component doesn't render anything
}
