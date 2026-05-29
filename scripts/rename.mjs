#!/usr/bin/env node
/**
 * Rename script — mengganti semua referensi "synergy-ai-starter" dan "@repo"
 * dengan nama project baru.
 *
 * Usage: node scripts/rename.mjs <new-project-name> [new-scope]
 * Example: node scripts/rename.mjs my-saas-app @myapp
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const [, , newName, newScope] = process.argv;

if (!newName) {
  console.error('❌  Usage: node scripts/rename.mjs <new-project-name> [new-scope]');
  console.error('   Example: node scripts/rename.mjs my-saas-app @myapp');
  process.exit(1);
}

const OLD_NAME = 'synergy-ai-starter';
const OLD_SCOPE = '@repo';
const resolvedScope = newScope ?? `@${newName}`;

const EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.yaml', '.yml',
  '.md', '.env.example', '.txt', '.toml',
]);

const EXCLUDE_DIRS = new Set([
  'node_modules', '.git', '.turbo', '.next', '.expo', 'dist', 'coverage',
]);

let fileCount = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (EXCLUDE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (EXTENSIONS.has(extname(entry)) || entry.startsWith('.env')) {
      let content = readFileSync(full, 'utf8');
      const updated = content
        .replaceAll(OLD_SCOPE, resolvedScope)
        .replaceAll(OLD_NAME, newName);
      if (updated !== content) {
        writeFileSync(full, updated, 'utf8');
        fileCount++;
        console.log(`  ✅ ${full.replace(process.cwd() + '/', '')}`);
      }
    }
  }
}

console.log(`\n🔄 Renaming project:`);
console.log(`   ${OLD_NAME} → ${newName}`);
console.log(`   ${OLD_SCOPE}/* → ${resolvedScope}/*\n`);

walk(process.cwd());

console.log(`\n✨ Done! ${fileCount} file(s) updated.`);
console.log(`\n⚡ Next steps:`);
console.log(`   1. Run: pnpm install`);
console.log(`   2. Run: git add -A && git commit -m "chore: rename project to ${newName}"\n`);
