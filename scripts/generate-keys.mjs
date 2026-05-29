#!/usr/bin/env node
/**
 * Generate RSA key pair untuk JWT RS256.
 * Jalankan sekali setelah clone: node scripts/generate-keys.mjs
 * Output: apps/api/private.key dan apps/api/public.key
 * Tambahkan isi key ke .env sebagai JWT_PRIVATE_KEY dan JWT_PUBLIC_KEY
 */

import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
});

const apiDir = join(__dirname, '..', 'apps', 'api');
writeFileSync(join(apiDir, 'private.key'), privateKey, 'utf8');
writeFileSync(join(apiDir, 'public.key'), publicKey, 'utf8');

console.log('\n🔑 RSA key pair generated!');
console.log('   private.key → apps/api/private.key');
console.log('   public.key  → apps/api/public.key');
console.log('\n📋 Copy these to apps/api/.env:');
console.log(`\nJWT_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"`);
console.log(`JWT_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"`);
console.log('\n⚠️  NEVER commit private.key to git! Already in .gitignore.\n');
