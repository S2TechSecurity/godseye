import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';

const USER_AGENT = 'S2Tech-CI-Lab/0.1 (+read-only feed health)';
const TIMEOUT_MS = 30000;

async function fetchText(url) {
  const started = performance.now();
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      text,
      latencyMs: Math.round(performance.now() - started),
      error: response.ok ? null : `HTTP_${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      text: '',
      latencyMs: Math.round(performance.now() - started),
      error: error instanceof Error ? error.name : 'FETCH_FAILED',
    };
  }
}

async function fetchJson(url) {
  const result = await fetchText(url);
  if (!result.ok) return { ...result, data: null };
  try {
    return { ...result, data: JSON.parse(result.text) };
  } catch {
    return { ...result, ok: false, data: null, error: 'INVALID_JSON' };
  }
}

async function readManifest(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

function arrayLength(value) {
  return Array.isArray(value) ? value.length : 0;
}

const [
  adsbLol,
  openSky,
  usgs,
  portsLive,
  celestrak,
  satelliteManifest,
  portsManifest,
] = await Promise.all([
  fetchJson('https://api.adsb.lol/v2/point/0/0/10000'),
  fetchJson('https://opensky-network.org/api/states/all'),
  fetchJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'),
  fetchJson('https://msi.nga.mil/api/publications/world-port-index?output=json'),
  fetchText('https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle'),
  readManifest(new URL('../public/manifests/satellite-active.json', import.meta.url)),
  readManifest(new URL('../public/manifests/maritime-ports.json', import.meta.url)),
]);

const metrics = {
  ADSB_LOL_GLOBAL: arrayLength(adsbLol.data?.ac),
  OPENSKY_GLOBAL: arrayLength(openSky.data?.states),
  USGS_ALL_DAY: arrayLength(usgs.data?.features),
  GLOBAL_PORTS_LIVE: arrayLength(portsLive.data?.ports),
  SATELLITE_MANIFEST_RECORDS:
    Number(satelliteManifest?.recordCount) || arrayLength(satelliteManifest?.records),
  MARITIME_PORTS_MANIFEST_RECORDS:
    Number(portsManifest?.recordCount) || arrayLength(portsManifest?.ports),
  CELESTRAK_ACTIVE_RECORDS: celestrak.ok
    ? Math.floor(celestrak.text.split(/\r?\n/).filter(Boolean).length / 3)
    : 0,
};

const sources = [
  ['ADSB_LOL', adsbLol],
  ['OPENSKY', openSky],
  ['USGS', usgs],
  ['GLOBAL_PORTS', portsLive],
  ['CELESTRAK', celestrak],
];

console.log('== S2 CI Public Feed Lab ==');
for (const [key, value] of Object.entries(metrics)) {
  console.log(`${key} ${value}`);
}

console.log('');
console.log('== Source Health ==');
for (const [name, result] of sources) {
  console.log(
    `${name} status=${result.ok ? 'LIVE' : 'DEGRADED'} http=${result.status ?? 'ERR'} latency_ms=${result.latencyMs} error=${result.error ?? 'none'}`,
  );
}

const checks = [
  {
    label: 'Global flight coverage',
    pass: Math.max(metrics.ADSB_LOL_GLOBAL, metrics.OPENSKY_GLOBAL) >= 10,
  },
  {
    label: 'Satellite catalog coverage',
    pass:
      Math.max(metrics.CELESTRAK_ACTIVE_RECORDS, metrics.SATELLITE_MANIFEST_RECORDS) >=
      100,
  },
  {
    label: 'Seismic feed availability',
    pass: usgs.ok && Array.isArray(usgs.data?.features),
  },
  {
    label: 'Global ports coverage',
    pass:
      Math.max(
        metrics.GLOBAL_PORTS_LIVE,
        metrics.MARITIME_PORTS_MANIFEST_RECORDS,
      ) >= 100,
  },
];

const failed = checks.filter((check) => !check.pass);
if (failed.length) {
  console.error('');
  console.error(
    'Feed smoke audit failed: ' + failed.map((check) => check.label).join(', '),
  );
  process.exit(1);
}

const degraded = sources.filter(([, result]) => !result.ok).map(([name]) => name);
console.log('');
if (degraded.length) {
  console.log('LAB_RESULT PASS_DEGRADED');
  console.log('DEGRADED_SOURCES ' + degraded.join(','));
} else {
  console.log('LAB_RESULT PASS');
}
