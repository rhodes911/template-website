import type { SimpleService } from '@/lib/client/serviceTypes';
import { getFooterData } from '@/lib/site-data';
import FooterClient from './FooterClient';

// Client component wrapper around the server component
export default async function Footer({ services }: { services: SimpleService[] }) {
  const footerData = await getFooterData();
  return <FooterClient services={services} footerData={footerData} />;
}
