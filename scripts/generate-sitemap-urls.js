/**
 * Houzdey — Generate sitemap-urls.json
 *
 * Fetches every property from the Houzdey API and writes
 * scripts/sitemap-urls.json, which google-index.js reads.
 *
 * Usage:
 *   node scripts/generate-sitemap-urls.js
 *
 * Set API_URL if your backend runs somewhere other than the default:
 *   API_URL=https://api.houzdey.com/api/v1 node scripts/generate-sitemap-urls.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DOMAIN = 'https://houzdey.com';
const API_URL = process.env.API_URL || 'https://api.houzdey.com/api/v1';
const PAGE_SIZE = 50;
const OUTPUT_PATH = path.join(__dirname, 'sitemap-urls.json');

const STATIC_PAGES = [
  '/',
  '/properties/for-rent',
  '/properties/for-sale',
  '/about',
  '/contact',
];

const NIGERIA_STATE_SLUGS = [
  'abia', 'anambra', 'ebonyi', 'enugu', 'imo',
  'akwa-ibom', 'bayelsa', 'cross-river', 'delta', 'edo', 'rivers',
  'ekiti', 'lagos', 'ogun', 'ondo', 'osun', 'oyo',
  'benue', 'fct-abuja', 'kogi', 'kwara', 'nasarawa', 'niger', 'plateau',
  'adamawa', 'bauchi', 'borno', 'gombe', 'taraba', 'yobe',
  'jigawa', 'kaduna', 'kano', 'katsina', 'kebbi', 'sokoto', 'zamfara',
];

const STATE_PAGES = NIGERIA_STATE_SLUGS.map((s) => `/state/${s}`);

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function fetchAllProperties() {
  const properties = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const url = `${API_URL}/properties?page=${page}&limit=${PAGE_SIZE}`;
    process.stdout.write(`  Fetching page ${page}...`);

    const data = await fetchJson(url);
    const batch = data.properties || [];
    properties.push(...batch);
    hasNext = data.pagination?.has_next || false;
    console.log(` ${batch.length} properties (total so far: ${properties.length})`);
    page++;
  }

  return properties;
}

async function main() {
  console.log('\nHouzdey — Generate Sitemap URLs');
  console.log(`API    : ${API_URL}`);
  console.log(`Domain : ${DOMAIN}\n`);

  const properties = await fetchAllProperties();

  const propertyUrls = properties
    .filter((p) => p.slug)
    .map((p) => ({ url: `${DOMAIN}/properties/${p.slug}` }));

  const staticUrls = STATIC_PAGES.map((p) => ({ url: `${DOMAIN}${p}` }));
  const stateUrls = STATE_PAGES.map((p) => ({ url: `${DOMAIN}${p}` }));
  const pages = [...staticUrls, ...stateUrls, ...propertyUrls];

  const output = {
    domain: DOMAIN,
    generated_at: new Date().toISOString(),
    total: pages.length,
    pages,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  console.log(`\nDone.`);
  console.log(`  Static pages : ${staticUrls.length}`);
  console.log(`  State pages  : ${stateUrls.length}`);
  console.log(`  Properties   : ${propertyUrls.length}`);
  console.log(`  Total URLs   : ${pages.length}`);
  console.log(`  Written to   : ${OUTPUT_PATH}\n`);
}

main().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
