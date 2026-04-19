import fs from 'fs';
import path from 'path';
import { pseoData } from './src/data/pseo.js';

// Define the base URL of your platform
const BASE_URL = 'https://bepreemptly.com';

// Define static routes
const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/privacy', changefreq: 'monthly', priority: 0.3 }
];

// Combine dynamic generated routes from our PSEO matrix
const dynamicRoutes = pseoData.map(data => ({
  path: `/intercept/${data.slug}`,
  changefreq: 'daily',
  priority: 0.8
}));

const generateSitemap = () => {
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  const today = new Date().toISOString().split('T')[0];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');

  console.log(`✅ Automatically generated sitemap.xml with ${allRoutes.length} routes at ${sitemapPath}`);
};

generateSitemap();
