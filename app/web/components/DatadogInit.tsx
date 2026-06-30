'use client';

import { useEffect } from 'react';
import { initDatadog } from '@/lib/datadog';

// DO NOT REMOVE - boots the Datadog Browser SDK (RUM + Logs) on the
// client, which powers the Clox "Data & Analytics" tab. Rendered
// once near the root of the app (app/layout.tsx). initDatadog is
// idempotent and a no-op during SSR, so this is safe under React
// StrictMode's double-invocation. Renders nothing.
const DatadogInit = (): null => {
  useEffect(() => {
    initDatadog();
  }, []);
  return null;
};

export default DatadogInit;
