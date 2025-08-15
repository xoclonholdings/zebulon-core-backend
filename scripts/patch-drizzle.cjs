// Patch script to recursively overwrite all drizzle-orm type files with empty files
const fs = require('fs');
const path = require('path');

const DRIZZLE_PATH = path.join(__dirname, '../node_modules/drizzle-orm');

function patchFile(filePath) {
  // Overwrite with a valid empty module
  fs.writeFileSync(filePath, 'export {};// patched by zebulon-core-backend\n');
}

function patchDirectory(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      patchDirectory(fullPath);
    } else if (entry.isFile() && /\.(d\.ts|d\.cts|d\.mts|ts|cts|mts)$/.test(entry.name)) {
      patchFile(fullPath);
    }
  });
}

if (fs.existsSync(DRIZZLE_PATH)) {
  patchDirectory(DRIZZLE_PATH);
  console.log('Patched all drizzle-orm type files with empty files.');
} else {
  console.warn('drizzle-orm not found in node_modules.');
}
