const fs = require('fs');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

(async function(){
  const seedPath = path.join(__dirname, '..', 'prisma', 'seed.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  // Find unsplash ids used via unsplashUrl('photo-...') and construct URLs
  const idRe = /unsplashUrl\('([^']+)'(?:,\s*\d+)?\)/g;
  const ids = [];
  let m;
  while ((m = idRe.exec(content)) !== null) ids.push(m[1]);

  // Also capture any raw images.unsplash.com occurrences
  const rawRe = /https:\/\/images\.unsplash\.com\/([\w\-]+)/g;
  while ((m = rawRe.exec(content)) !== null) ids.push(m[1]);

  const uniqueIds = [...new Set(ids)];
  console.log(`Found ${uniqueIds.length} unique Unsplash ids.`);

  const construct = (id, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

  for (const id of uniqueIds) {
    const url = construct(id);
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(res.status, url);
    } catch (e) {
      console.log('ERR', url, e.message);
    }
  }
})();
