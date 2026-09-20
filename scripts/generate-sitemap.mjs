#!/usr/bin/env node
/**
 * generate-sitemap.mjs
 * Automatically generates public/sitemap.xml containing all canonical URLs
 * for Md Asif Mohammed Asif M H portfolio (mdasif.tech).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL  = 'https://mdasif.tech';
const OUTPUT    = path.resolve(__dirname, '../public/sitemap.xml');

// All canonical routes (pages, apps, sections, project details, blog posts, gallery sections)
const routes = [
  '/',
  '/about',
  '/skills',
  '/experience',
  '/certificates',
  '/projects',
  '/projects/llm-agent',
  '/projects/rag-pipeline',
  '/projects/vision-classifier',
  '/projects/sentiment-api',
  '/projects/macos-portfolio',
  '/blog',
  '/blog/building-production-rag-with-qdrant',
  '/blog/serving-qwen-with-vllm',
  '/blog/aws-rag-architecture',
  '/blog/my-ai-engineering-projects',
  '/blog/how-i-built-my-llm-api',
  '/contact',
  '/gallery',
  '/gallery/my-photos',
  '/gallery/certificates',
  '/gallery/videos',
  '/apps/finder',
  '/apps/photos',
  '/apps/terminal',
  '/apps/safari',
  '/apps/mail',
  '/apps/music',
  '/apps/activitymonitor',
  '/apps/calendar',
  '/apps/settings',
];

const today = new Date().toISOString().split('T')[0];

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${SITE_URL}${r === '/' ? '' : r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === '/' || r === '/about' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${r === '/' ? '1.0' : r === '/about' || r.startsWith('/apps/') || r === '/gallery' ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, xmlContent.trim());
console.log(`✅ Sitemap generated at public/sitemap.xml (${routes.length} URLs)`);
