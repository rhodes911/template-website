import type { SimpleService } from '@/lib/client/serviceTypes';
import FooterClient from './FooterClient';

// Client component wrapper around the server component
export default function Footer({ services }: { services: SimpleService[] }) {
  return <FooterClient services={services} />;
}
