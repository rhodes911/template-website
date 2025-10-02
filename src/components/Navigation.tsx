import NavigationClient from './NavigationClient';
import NavigationLogo from './NavigationLogo';
import { getHeaderData } from '@/lib/site-data';
import { getSimpleServices } from '@/lib/server/services';

export default function Navigation() {
  const headerData = getHeaderData();
  const services = getSimpleServices();

  return (
    <NavigationClient 
      logo={<NavigationLogo headerData={headerData} />}
      headerData={headerData}
      services={services}
    />
  );
}
