#!/usr/bin/env node
/**
 * generate-sitemap.mjs
 * Automatically generates public/sitemap.xml containing all canonical URLs
 * for Mohammed Asif M H portfolio (mdasif.tech).
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

const IMAGES = [
  {
    loc: `${SITE_URL}/mohammed-asif-m-h.jpg`,
    title: 'Mohammed Asif M H — Primary Headshot',
    caption: 'Official primary headshot photo of Mohammed Asif M H, AI/ML Engineer.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-formal-suit-portrait-1.jpg`,
    title: 'Mohammed Asif M H — Formal Suit Portrait Photo',
    caption: 'Official formal suit blazer portrait of Mohammed Asif M H, AI Systems Engineer.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-formal-suit-portrait-2.jpg`,
    title: 'Mohammed Asif M H — Professional Suit Headshot',
    caption: 'Professional formal suit portrait of Mohammed Asif M H.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-formal-suit-phone-outdoor.jpg`,
    title: 'Mohammed Asif M H — Outdoor Formal Suit Photo',
    caption: 'Mohammed Asif M H standing outdoors in dark suit blazer holding smartphone.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-formal-suit-side-profile-1.jpg`,
    title: 'Mohammed Asif M H — Standing Outdoor Suit Photo',
    caption: 'Mohammed Asif M H outdoors in formal blazer suit.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-formal-suit-side-profile-2.jpg`,
    title: 'Mohammed Asif M H — Professional Profile Photo',
    caption: 'Professional formal suit side profile of Mohammed Asif M H.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-portrait-ai-engineer.jpg`,
    title: 'Mohammed Asif M H — Portrait Photo',
    caption: 'Portrait photograph of Mohammed Asif M H in black hoodie.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-formal-suit-engineering-team.jpg`,
    title: 'Mohammed Asif M H — Engineering Team in Formal Suits',
    caption: 'Mohammed Asif M H with AI engineering colleagues in formal suit blazers.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-ai-research-mentorship.jpg`,
    title: 'Mohammed Asif M H — AI Research & Development Mentorship',
    caption: 'Mohammed Asif M H in AI research mentorship session with professor and laptops.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-school-green-initiative.jpg`,
    title: 'Mohammed Asif M H — School Green Initiative Plant Ceremony',
    caption: 'Mohammed Asif M H presenting rose plants during school green initiative event.'
  },
  {
    loc: `${SITE_URL}/mohammed-asif-m-h-traditional-college-cultural-event.jpg`,
    title: 'Mohammed Asif M H — College Traditional Festival',
    caption: 'Mohammed Asif M H celebrating college traditional day festival in white veshti/dhoti.'
  }
];

const today = new Date().toISOString().split('T')[0];

function renderImagesForRoute(r) {
  if (r === '/' || r === '/about' || r === '/gallery' || r === '/gallery/my-photos') {
    return IMAGES.map(img => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title.replace(/&/g, '&amp;')}</image:title>
      <image:caption>${img.caption.replace(/&/g, '&amp;')}</image:caption>
    </image:image>`).join('\n');
  }
  return '';
}

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map(r => {
  const imgs = renderImagesForRoute(r);
  return `  <url>
    <loc>${SITE_URL}${r === '/' ? '' : r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === '/' || r === '/about' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${r === '/' ? '1.0' : r === '/about' || r.startsWith('/apps/') || r === '/gallery' ? '0.9' : '0.8'}</priority>${imgs ? '\n' + imgs : ''}
  </url>`;
}).join('\n')}
</urlset>`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, xmlContent.trim());
console.log(`✅ Sitemap with Google Image Schema generated at public/sitemap.xml (${routes.length} URLs, ${IMAGES.length} indexed images)`);
