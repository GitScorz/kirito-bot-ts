export function parseMS(ms: number) { // Parse milliseconds to a human readable string
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const s = seconds % 60;
  const m = minutes % 60;
  const h = hours % 24;

  return `${h}h:${m}m:${s}s`;
}