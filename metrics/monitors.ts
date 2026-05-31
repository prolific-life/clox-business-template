/**
 * Cron-driven KPI monitors. Vercel Cron (see
 * app/web/vercel.json crons block) calls each function
 * on a schedule; each one computes the current value of
 * its KPI and POSTs to /api/metrics/log inside the
 * spawned app, which appends to metrics/datapoints/.
 *
 * Phase 0 ships an empty monitor array — the
 * log-metric skill (task 5+) seeds real monitors as the
 * v9 agent learns what to track.
 */

export type Monitor = {
  id: string;
  metricId: string;
  cron: string;
  compute: () => Promise<number>;
};

export const monitors: Monitor[] = [];
