import { getSimpleServices } from '@/lib/server/services';
import FooterClientWrapper from './FooterClientWrapper';

// Server component that fetches data
const Footer = () => {
  const services = getSimpleServices();
  
  return <FooterClientWrapper services={services} />;
};

export default Footer;
