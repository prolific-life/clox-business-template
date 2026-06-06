// Datadog Browser SDK (RUM + Logs) for generated business apps.
//
// Ships sessions + logs to the SAME Clox master Datadog org as
// core/web_ui — this mirrors clox_ui_kit/src/lib/datadog.ts so every
// generated business is observable from one account out of the box.
//
// The RUM application id + client token below are PUBLIC by design:
// Datadog browser credentials are meant to live in client bundles
// (like a Stripe publishable key), and are distinct from the server
// DD_API_KEY (full access, never shipped to a browser). Hardcoding
// them means a generated business ships observability with zero
// config; all telemetry lands in the one master org.
//
// Per-deploy overrides come from NEXT_PUBLIC_DD_* (inlined at build
// time by Next.js). Set NEXT_PUBLIC_DD_SERVICE to the business slug to
// make each app filterable; otherwise everything shares the
// "clox_business_app" service facet.

import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

// Public Clox master-org RUM application id + client token (same
// values core/web_ui ships). Safe to embed — see header.
const DEFAULT_RUM_APPLICATION_ID = 'eb1b4492-f69a-494d-989f-7a94289a2b3b';
const DEFAULT_CLIENT_TOKEN = 'pubde8334e4708bf9e62ddeee52341033cb';

// A deployed business runs on its Vercel / custom domain; only local
// dev runs on localhost. So any non-localhost host is "production".
const detectEnv = (): string => {
  if (typeof window === 'undefined' || !window.location) {
    return 'development';
  }
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1'
    ? 'development'
    : 'production';
};

let initialized = false;

// Boot Datadog RUM + Logs. Idempotent and a no-op during SSR, so it's
// safe to call from a client component effect under React StrictMode's
// double-invoke. Returns true once the SDKs actually start.
export const initDatadog = (): boolean => {
  if (initialized || typeof window === 'undefined') {
    return initialized;
  }
  const applicationId =
    process.env.NEXT_PUBLIC_DD_RUM_APPLICATION_ID ||
    DEFAULT_RUM_APPLICATION_ID;
  const clientToken =
    process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN || DEFAULT_CLIENT_TOKEN;
  if (!applicationId || !clientToken) {
    return false;
  }
  const site = process.env.NEXT_PUBLIC_DD_SITE || 'us5.datadoghq.com';
  const service =
    process.env.NEXT_PUBLIC_DD_SERVICE || 'clox_business_app';
  const env = detectEnv();
  const version = process.env.NEXT_PUBLIC_DD_VERSION || 'unknown';

  datadogRum.init({
    applicationId,
    clientToken,
    site,
    service,
    env,
    version,
    sessionSampleRate: 10,
    sessionReplaySampleRate: 10,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
    // Correlate browser spans with the app's own same-origin
    // route handlers / API routes.
    allowedTracingUrls: [window.location.origin],
  });

  datadogLogs.init({
    clientToken,
    site,
    service,
    env,
    version,
    forwardConsoleLogs: ['log', 'debug', 'info', 'warn', 'error'],
    forwardErrorsToLogs: true,
    sessionSampleRate: 10,
  });

  initialized = true;
  return true;
};
