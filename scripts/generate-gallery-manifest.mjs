#!/usr/bin/env node
/**
 * generate-gallery-manifest.mjs
 * Scans public/gallery/* folders and writes public/gallery/manifest.json
 * Runs automatically as "predev" and "prebuild" in package.json
 *
 * Just drop image/video files into the folders and the manifest auto-updates:
 *   public/gallery/my-photos/    ← personal photos (jpg, png, webp, gif, avif)
 *   public/gallery/certificates/ ← certificate images
 *   public/gallery/videos/       ← videos (mp4, mov, webm)
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GALLERY_DIR = path.resolve(__dirname, '../public/gallery');
const OUTPUT_FILE = path.join(GALLERY_DIR, 'manifest.json');

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
const VIDEO_EXTS = ['.mp4', '.mov', '.webm', '.mkv'];

const FOLDERS = [
  { id: 'my-photos',    label: 'My Photos',    icon: '🖼️',  color: '#007AFF' },
  { id: 'certificates', label: 'Certificates', icon: '🏆',  color: '#FF9F0A' },
  { id: 'videos',       label: 'Videos',       icon: '🎬',  color: '#FF375F' },
];

function scan(folder) {
  const dir = path.join(GALLERY_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return [];
  }

  return fs.readdirSync(dir)
    .filter(f => !f.startsWith('.'))
    .map(filename => {
      const ext  = path.extname(filename).toLowerCase();
      const type = IMAGE_EXTS.includes(ext) ? 'image'
                 : VIDEO_EXTS.includes(ext) ? 'video'
                 : null;
      if (!type) return null;

      const stat = fs.statSync(path.join(dir, filename));
      const name = path.basename(filename, ext)
                     .replace(/[-_]/g, ' ')
                     .trim();

      return {
        filename,
        name,
        type,
        src: `/gallery/${folder}/${encodeURIComponent(filename)}`,
        size: stat.size,
        modified: stat.mtime.toISOString(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.modified) - new Date(a.modified));
}

// Ensure gallery dir exists
if (!fs.existsSync(GALLERY_DIR)) fs.mkdirSync(GALLERY_DIR, { recursive: true });

const manifest = FOLDERS.map(f => ({
  ...f,
  items: scan(f.id),
}));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

const total = manifest.reduce((sum, f) => sum + f.items.length, 0);
console.log(`✅ Gallery manifest: ${total} items across ${manifest.length} folders`);
manifest.forEach(f => console.log(`   📁 ${f.label}: ${f.items.length} item(s)`));
