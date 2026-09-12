/**
 * Hostinger Automated Post-Build Deployment Hook
 * 
 * Hostinger's Git deployment builds inside a sandbox directory (e.g. /home/uXXXX/hbuilds/...).
 * This script ensures:
 * 1. All compiled assets in dist/ have correct read permissions (0755 for dirs, 0644 for files).
 * 2. All built assets and .htaccess are synced automatically into the live public_html web root.
 */

const fs = require('fs');
const path = require('path');

function fixPermissions(targetPath) {
  try {
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) {
      fs.chmodSync(targetPath, 0o755);
      const items = fs.readdirSync(targetPath);
      for (const item of items) {
        fixPermissions(path.join(targetPath, item));
      }
    } else {
      fs.chmodSync(targetPath, 0o644);
    }
  } catch (err) {
    // Non-fatal if permission cannot be changed on some environments
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    try { fs.chmodSync(dest, 0o755); } catch (e) {}
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      try { fs.chmodSync(destPath, 0o644); } catch (e) {}
    }
  }
  try { fs.chmodSync(dest, 0o755); } catch (e) {}
}

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.log('⚠️ dist directory not found, skipping sync.');
  process.exit(0);
}

// Ensure dist has proper web permissions
fixPermissions(distDir);

// Detect all possible public_html paths on Hostinger
const candidatePublicHtmlPaths = [
  path.resolve(rootDir, '..', 'public_html'),
  path.resolve(rootDir, '..', '..', 'public_html'),
  path.resolve(rootDir, '..', '..', '..', 'public_html'),
  path.resolve(process.cwd(), '..', 'public_html'),
  path.resolve(process.cwd(), '..', '..', 'public_html')
];

let synced = false;
for (const publicHtmlPath of candidatePublicHtmlPaths) {
  // Check if this is a valid public_html directory outside of dist
  if (fs.existsSync(publicHtmlPath) && publicHtmlPath !== distDir) {
    console.log(`🚀 [Hostinger Deploy Hook] Auto-syncing dist -> ${publicHtmlPath}`);
    try {
      copyRecursive(distDir, publicHtmlPath);
      console.log(`✅ [Hostinger Deploy Hook] Successfully populated ${publicHtmlPath}`);
      synced = true;
    } catch (err) {
      console.error(`⚠️ [Hostinger Deploy Hook] Could not copy to ${publicHtmlPath}:`, err.message);
    }
  }
}

if (!synced) {
  console.log('ℹ️ [Hostinger Deploy Hook] No parent public_html directory found; dist/ is ready for standard serving.');
}
