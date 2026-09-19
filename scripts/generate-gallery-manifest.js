#!/usr/bin/env node
/**
 * generate-gallery-manifest.js
 * Scans public/gallery/* folders and writes public/gallery/manifest.json
 * Run via: node scripts/generate-gallery-manifest.js
 * Or automatically as part of the build: "prebuild" in package.json
 *
 * Drop any image (jpg, jpeg, png, gif, webp, avif) or video (mp4, mov, webm)
 * into the appropriate subfolder and this script will pick it up automatically.
 */

const fs   = require('fs');
const path = require('path');

const GALLERY_DIR = path.resolve(__dirname, '../public/gallery');
const OUTPUT_FILE = path.join(GALLERY_DIR, 'manifest.json');

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'];
const VIDEO_EXTS = ['.mp4', '.mov', '.webm', '.mkv'];

const FOLDERS = [
  { id: 'my-photos',    label: 'My Photos',    icon: '🖼️' },
  { id: 'certificates', label: 'Certificates', icon: '🏆' },
  { id: 'videos',       label: 'Videos',       icon: '🎬' },
];

function scan(folder) {
  const dir = path.join(GALLERY_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return [];
  }

  return fs.readdirSync(dir)
    .filter(f => !f.startsWith('.'))  // skip hidden files
    .map(filename => {
      const ext  = path.extname(filename).toLowerCase();
      const type = IMAGE_EXTS.includes(ext) ? 'image'
                 : VIDEO_EXTS.includes(ext) ? 'video'
                 : null;
      if (!type) return null;

      const stat  = fs.statSync(path.join(dir, filename));
      const name  = path.basename(filename, ext)
                      .replace(/[-_]/g, ' ')
                      .replace(/\s+/g, ' ')
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
    .sort((a, b) => new Date(b.modified) - new Date(a.modified)); // newest first
}

const manifest = FOLDERS.map(f => ({
  ...f,
  items: scan(f.id),
}));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

const total = manifest.reduce((sum, f) => sum + f.items.length, 0);
console.log(`✅ Gallery manifest generated: ${total} items across ${manifest.length} folders`);
manifest.forEach(f => {
  console.log(`   📁 ${f.label}: ${f.items.length} item(s)`);
});
