#!/usr/bin/env node
/**
 * Upload all images from public/images to Cloudinary and generate a path -> URL map.
 * Uses Cloudinary keys from server/.env (run from drinkmate-main: node scripts/upload-images-to-cloudinary.cjs).
 * Keeps local images as backup; map is used for Cloudinary URLs with local fallback in app.
 * Output: lib/constants/cloudinary-image-map.json
 */

const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');
const SERVER_ENV = path.join(ROOT, '..', 'server', '.env');
const OUT_MAP = path.join(ROOT, 'lib', 'constants', 'cloudinary-image-map.json');

// Load server/.env
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error('Missing server/.env at', filePath);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  });
}

loadEnv(SERVER_ENV);

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in server/.env');
  process.exit(1);
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

const SKIP_EXT = new Set(['.md', '.xmp', '.json']);
const UPLOAD_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif', '.bmp', '.ico',
  '.webm', '.mp4', '.mov',
]);

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, fileList);
    else {
      const ext = path.extname(e.name).toLowerCase();
      if (!SKIP_EXT.has(ext)) fileList.push(full);
    }
  }
  return fileList;
}

function toPublicPath(absPath) {
  const normalized = path.normalize(absPath).replace(/\\/g, '/');
  const idx = normalized.indexOf('public/');
  if (idx === -1) return null;
  // Return /images/... (app path), not /public/images/...
  const afterPublic = normalized.slice(idx + 'public/'.length);
  return '/' + afterPublic;
}

async function uploadOne(filePath) {
  const publicPath = toPublicPath(filePath);
  if (!publicPath || !publicPath.startsWith('/images/')) return null;

  const ext = path.extname(filePath).toLowerCase();
  if (!UPLOAD_EXT.has(ext)) return { publicPath, skip: true, reason: 'unsupported type' };

  // public_id: drinkmate/images/payment-logos/visa (no leading slash, no extension for Cloudinary)
  const relative = publicPath.slice(1); // images/payment-logos/visa.svg
  const publicId = 'drinkmate/' + relative.replace(/\.[a-z0-9]+$/i, '').replace(/\s+/g, '-');

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: /\.(webm|mp4|mov)$/i.test(path.basename(filePath)) ? 'video' : 'image',
    });
    return { publicPath, url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error('Upload failed', publicPath, err.message);
    return { publicPath, error: err.message };
  }
}

async function main() {
  const onlyPaths = process.argv.slice(2).filter((a) => a.startsWith('/images/'));
  let files = walkDir(PUBLIC_IMAGES);
  if (onlyPaths.length > 0) {
    const pathSet = new Set(onlyPaths);
    files = files.filter((f) => {
      const p = toPublicPath(f);
      return p && pathSet.has(p);
    });
    console.log('Uploading', files.length, 'specific file(s)...');
  } else {
    console.log('Uploading', files.length, 'files from public/images...');
  }

  let map = {};
  if (onlyPaths.length > 0 && fs.existsSync(OUT_MAP)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUT_MAP, 'utf8'));
      map = existing.map || {};
    } catch (_) {}
  }
  let ok = 0;
  let skip = 0;
  let err = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rel = path.relative(PUBLIC_IMAGES, file).replace(/\\/g, '/');
    process.stdout.write(`\r[${i + 1}/${files.length}] ${rel.slice(0, 50).padEnd(50)}`);

    const out = await uploadOne(file);
    if (!out) continue;
    if (out.skip) {
      skip++;
      continue;
    }
    if (out.error) {
      err++;
      continue;
    }
    map[out.publicPath] = out.url;
    ok++;
  }

  console.log('\nDone. Uploaded:', ok, 'Skipped:', skip, 'Errors:', err);

  const dir = path.dirname(OUT_MAP);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const payload = {
    generatedAt: new Date().toISOString(),
    cloudName,
    map,
    count: Object.keys(map).length,
  };
  fs.writeFileSync(OUT_MAP, JSON.stringify(payload, null, 2), 'utf8');
  console.log('Map written to', OUT_MAP);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
