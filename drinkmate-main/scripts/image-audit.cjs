#!/usr/bin/env node
/**
 * Image audit: scan codebase for all /images/ references and getBannerSrc usage,
 * list files on disk under public/images, and output a mapping (path -> where used).
 * Output: scripts/image-audit.json
 * Run: node scripts/image-audit.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');
const OUT_FILE = path.join(ROOT, 'scripts', 'image-audit.json');

const BANNER_KEY_TO_PATHS = {
  shop: ['/images/bannerNew/shop.png', '/images/bannerNew/shopArbaic.png', '/images/bannerNew/shopShop.png', '/images/bannerNew/shopArabicShop.png'],
  accessories: ['/images/bannerNew/accessorice.png', '/images/bannerNew/accessoriceArabic.png', '/images/bannerNew/accessoriceShop.png', '/images/bannerNew/accessoriceArabicshop.png'],
  italianSyrup: ['/images/bannerNew/italianSyrup.png', '/images/bannerNew/italianSyrpArabic.png', '/images/bannerNew/italianSyrupShop.png', '/images/bannerNew/italianSyrupShopArabic.png'],
  refill: ['/images/bannerNew/refill.png', '/images/bannerNew/refillShop.png'],
  sodamaker: ['/images/bannerNew/sodaMakerBanner.png', '/images/bannerNew/sodamakerArabic.png', '/images/bannerNew/sodamaker.png'],
  co2: ['/images/bannerNew/co2.png', '/images/bannerNew/co2Arabic.png'],
  flavour: ['/images/bannerNew/flavour.png', '/images/bannerNew/flavourArabic.png'],
  recipes: ['/images/bannerNew/recipes.png'],
};

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, fileList);
    else if (!e.name.startsWith('.')) fileList.push(full);
  }
  return fileList;
}

function toPublicPath(absPath) {
  const normalized = path.normalize(absPath).replace(/\\/g, '/');
  const idx = normalized.indexOf('public/');
  if (idx === -1) return null;
  return '/' + normalized.slice(idx);
}

const IMAGE_PATH_RE = /["'`](\/images\/[^"'`\s]+)["'`]/g;
const GET_BANNER_RE = /getBannerSrc\s*\(\s*["']([^"']+)["']/g;

const referencedPaths = new Map();
const bannerUsages = new Map();

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');

  lines.forEach((line, i) => {
    let m;
    IMAGE_PATH_RE.lastIndex = 0;
    while ((m = IMAGE_PATH_RE.exec(line)) !== null) {
      const imgPath = m[1];
      if (!referencedPaths.has(imgPath)) referencedPaths.set(imgPath, []);
      referencedPaths.get(imgPath).push({
        file: relPath,
        line: i + 1,
        snippet: line.trim().slice(0, 120),
      });
    }

    GET_BANNER_RE.lastIndex = 0;
    while ((m = GET_BANNER_RE.exec(line)) !== null) {
      const key = m[1];
      if (!bannerUsages.has(key)) bannerUsages.set(key, []);
      bannerUsages.get(key).push({ file: relPath, line: i + 1 });
    }
  });
}

const dirsToScan = [path.join(ROOT, 'app'), path.join(ROOT, 'components'), path.join(ROOT, 'lib')];
const ext = ['.tsx', '.ts', '.jsx', '.js', '.json', '.css'];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') scanDir(full);
    else if (ext.some((x) => e.name.endsWith(x))) scanFile(full);
  }
}
dirsToScan.forEach((d) => scanDir(d));
['public/sw.js', 'public/manifest.json'].forEach((rel) => {
  const full = path.join(ROOT, rel);
  if (fs.existsSync(full)) scanFile(full);
});

for (const [key, usages] of bannerUsages) {
  const paths = BANNER_KEY_TO_PATHS[key];
  if (paths) {
    paths.forEach((p) => {
      if (!referencedPaths.has(p)) referencedPaths.set(p, []);
      usages.forEach((u) => {
        referencedPaths.get(p).push({ ...u, snippet: `getBannerSrc("${key}", ...)` });
      });
    });
  }
}

const filesOnDisk = walkDir(PUBLIC_IMAGES).map((abs) => toPublicPath(abs)).filter(Boolean);

const referencedByPath = {};
for (const [p, usages] of referencedPaths) {
  referencedByPath[p] = usages;
}

const audit = {
  generatedAt: new Date().toISOString(),
  publicImagesRoot: '/images',
  referencedPaths: referencedByPath,
  referencedPathList: [...referencedPaths.keys()].sort(),
  bannerKeysUsed: [...bannerUsages.keys()],
  filesOnDisk: filesOnDisk.sort(),
  filesOnDiskCount: filesOnDisk.length,
  missing: [...referencedPaths.keys()].filter((p) => {
    const localPath = p.startsWith('/') ? p.slice(1) : p;
    const full = path.join(ROOT, 'public', localPath);
    return !fs.existsSync(full);
  }),
};

fs.writeFileSync(OUT_FILE, JSON.stringify(audit, null, 2), 'utf8');
console.log('Image audit written to', OUT_FILE);
console.log('Referenced paths:', audit.referencedPathList.length);
console.log('Files on disk (public/images):', audit.filesOnDiskCount);
console.log('Missing (referenced but not on disk):', audit.missing.length);
