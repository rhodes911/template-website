import NavigationClient from './NavigationClient';
import NavigationLogo from './NavigationLogo';

export default function Navigation() {
  return (
    <NavigationClient logo={<NavigationLogo />} />
  );
}
