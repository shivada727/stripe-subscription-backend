export function resolveFutureMonthlyAnchor(anchorAt: number): number {
  const nowSec = Math.floor(Date.now() / 1000);
  if (!Number.isFinite(anchorAt)) return nowSec + 60; 

  if (anchorAt > nowSec) return Math.floor(anchorAt);

  const base = new Date(anchorAt * 1000); 
  const now = new Date(nowSec * 1000);

  const targetDay = base.getUTCDate();
  const H = base.getUTCHours(), M = base.getUTCMinutes(), S = base.getUTCSeconds();

  let year = now.getUTCFullYear();
  let month = now.getUTCMonth() + 1; 
  if (month > 11) { month = 0; year += 1; }

  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(targetDay, lastDay);

  const next = Math.floor(Date.UTC(year, month, day, H, M, S) / 1000);
  return next > nowSec ? next : nowSec + 60;
}
