/**
 * Houzdey — Google Indexing API Batch URL Submission
 *
 * Prerequisites:
 *   1. Enable the "Indexing API" in Google Cloud Console for your project.
 *   2. Create a Service Account, download its JSON key, save as
 *      scripts/service-account.json  (never commit this file).
 *   3. In Google Search Console → Settings → Users and permissions,
 *      add the service account email as an OWNER of houzdey.com.
 *   4. npm install googleapis
 *
 * Typical workflow:
 *   node scripts/generate-sitemap-urls.js        # 1. build the URL list
 *   node scripts/google-index.js --dry-run       # 2. preview what will be sent
 *   node scripts/google-index.js --limit 200     # 3. submit first 200 (day 1)
 *   node scripts/google-index.js --offset 200 --limit 200  # day 2
 *   node scripts/google-index.js --offset 400 --limit 200  # day 3 … etc.
 *
 * Google Indexing API quota: 200 requests/day by default.
 */

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const SITEMAP_PATH = path.join(__dirname, 'sitemap-urls.json');
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json');
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : null;
const offsetIndex = args.indexOf('--offset');
const offset = offsetIndex !== -1 ? parseInt(args[offsetIndex + 1], 10) : 0;

function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`\nERROR: Service account credentials not found at:\n  ${CREDENTIALS_PATH}`);
    console.error('\nSteps to fix:');
    console.error('  1. Go to Google Cloud Console → IAM & Admin → Service Accounts');
    console.error('  2. Create a service account (or use existing)');
    console.error('  3. Download JSON key → save as scripts/service-account.json');
    console.error('  4. Add the service account email as Owner in Google Search Console\n');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES,
  });

  return auth.getClient();
}

async function submitUrl(authClient, url) {
  const indexing = google.indexing({ version: 'v3', auth: authClient });
  const response = await indexing.urlNotifications.publish({
    requestBody: { url, type: 'URL_UPDATED' },
  });
  return response.data;
}

async function main() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`\nERROR: ${SITEMAP_PATH} not found.`);
    console.error('Run this first:\n  node scripts/generate-sitemap-urls.js\n');
    process.exit(1);
  }

  const sitemap = JSON.parse(fs.readFileSync(SITEMAP_PATH, 'utf-8'));
  let urls = sitemap.pages.map((p) => p.url);
  urls = urls.slice(offset);
  if (limit) urls = urls.slice(0, limit);

  console.log(`\nHouzdey — Google Indexing API`);
  console.log(`Domain    : ${sitemap.domain}`);
  console.log(`Generated : ${sitemap.generated_at || 'unknown'}`);
  console.log(`Offset    : ${offset}`);
  console.log(`URLs      : ${urls.length} of ${sitemap.pages.length} total`);
  console.log(`Mode      : ${isDryRun ? 'DRY RUN (no requests sent)' : 'LIVE'}\n`);

  if (isDryRun) {
    urls.forEach((url, i) => console.log(`  [${i + 1}] ${url}`));
    console.log('\nDry run complete. Re-run without --dry-run to submit.\n');
    return;
  }

  const authClient = await getAuthClient();
  const results = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    process.stdout.write(`[${i + 1}/${urls.length}] ${url} ... `);

    try {
      const data = await submitUrl(authClient, url);
      console.log(`OK (${data.urlNotificationMetadata?.latestUpdate?.type ?? 'submitted'})`);
      results.success++;
      // 5 req/s burst limit — 250ms delay keeps us safe
      if (i < urls.length - 1) await new Promise((r) => setTimeout(r, 250));
    } catch (err) {
      const message = err.response?.data?.error?.message ?? err.message;
      console.log(`FAILED — ${message}`);
      results.failed++;
      results.errors.push({ url, error: message });
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Submitted : ${results.success}`);
  console.log(`Failed    : ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nFailed URLs:');
    results.errors.forEach((e) => console.log(`  ${e.url}\n  → ${e.error}`));
  }

  const logPath = path.join(__dirname, `indexing-log-${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify({ date: new Date().toISOString(), ...results }, null, 2));
  console.log(`\nLog saved to: ${logPath}\n`);
}

main().catch((err) => {
  console.error('\nUnexpected error:', err.message);
  process.exit(1);
});
