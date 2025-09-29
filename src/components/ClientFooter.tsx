'use client';

import type { SimpleService } from '@/lib/client/serviceTypes';
import { useEffect, useState } from 'react';
import FooterClient from './FooterClient';

// This is a client component version of Footer that fetches its own data
export default function ClientFooter() {
  const [services, setServices] = useState<SimpleService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services/simple');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Use empty array as fallback
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="bg-neutral-900 py-12">Loading footer...</div>;
  }

  return <FooterClient services={services} />;
}
