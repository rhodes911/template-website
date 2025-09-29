// This file re-exports types for backwards compatibility
// All server-side operations are moved to src/lib/server/services.ts
// All client-safe types are in src/lib/client/serviceTypes.ts

import type { Service, SimpleService, ServicePageData } from './client/serviceTypes';

// Re-export the types for backwards compatibility
export type { Service, SimpleService, ServicePageData };
