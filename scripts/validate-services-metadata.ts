import { getServices } from '../src/lib/server/services';

/**
 * Simple validation script for enriched service metadata.
 * Run via: ts-node scripts/validate-services-metadata.ts (or add npm script)
 */


function run() {
  const services = getServices();
  const warnings: string[] = [];
  services.forEach(s => {
    if (!s.goals) warnings.push(`[WARN] Service ${s.serviceId} missing field: goals`);
    if (!s.strategicPillar) warnings.push(`[WARN] Service ${s.serviceId} missing field: strategicPillar`);
    if (Array.isArray(s.goals) && s.goals.length === 0) warnings.push(`[WARN] Service ${s.serviceId} goals array empty`);
  });

  if (warnings.length) {
    console.log(`\nService Metadata Validation Warnings (${warnings.length})`);
    warnings.forEach(w => console.log(w));
  } else {
    console.log('All services have required enrichment fields.');
  }
}

run();
