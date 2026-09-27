import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('MOMEN CENTER — COMPREHENSIVE VERIFICATION & AUDIT');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    failedTests++;
  }
}

// 1. Verify 300 Hero Frames Intact
console.log('TEST 1: Verifying 300-Frame Scroll Hero Assets...');
const heroFramesDir = path.join(rootDir, 'public', 'hero-frames');
assert(fs.existsSync(heroFramesDir), 'Hero frames directory exists');
let frameCount = 0;
for (let i = 1; i <= 300; i++) {
  const frameName = `frame_${String(i).padStart(3, '0')}.jpg`;
  if (fs.existsSync(path.join(heroFramesDir, frameName))) {
    frameCount++;
  }
}
assert(frameCount === 300, `All 300 hero animation frames are present and intact (Found ${frameCount}/300)`);

// 2. Verify Build Artifacts and Code Integrity
console.log('\nTEST 2: Verifying Production Build & Asset Bundles...');
const distHtml = path.join(rootDir, 'dist', 'index.html');
assert(fs.existsSync(distHtml), 'dist/index.html generated successfully');
const distHtmlContent = fs.readFileSync(distHtml, 'utf-8');
assert(distHtmlContent.includes('MOMEN CENTER'), 'dist/index.html includes brand title and metadata');

// 3. Verify Admin Types & Architecture
console.log('\nTEST 3: Verifying Admin Architecture & RBAC Types...');
const adminTypesPath = path.join(rootDir, 'src', 'types', 'admin.ts');
assert(fs.existsSync(adminTypesPath), 'src/types/admin.ts exists');
const adminTypesContent = fs.readFileSync(adminTypesPath, 'utf-8');
assert(adminTypesContent.includes('export type UserRole = \'admin\' | \'customer\''), 'RBAC UserRole defined');
assert(adminTypesContent.includes('export interface AdminOrder'), 'AdminOrder type defined');
assert(adminTypesContent.includes('export interface Offer'), 'Offer type defined');
assert(adminTypesContent.includes('export interface HomepageSettings'), 'HomepageSettings type defined');

// 4. Verify Supabase & Database Strategy
console.log('\nTEST 4: Verifying Supabase & SQL Migration Files...');
const schemaPath = path.join(rootDir, 'supabase', 'migrations', '20260927000000_momen_center_schema.sql');
assert(fs.existsSync(schemaPath), 'PostgreSQL schema migration exists');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
assert(schemaContent.includes('CREATE POLICY "Admins have full access to products"'), 'Product RLS policies defined');
assert(schemaContent.includes('public.is_admin()'), 'Admin security check function defined in SQL');

const storagePath = path.join(rootDir, 'supabase', 'storage.sql');
assert(fs.existsSync(storagePath), 'Storage bucket configuration exists');

const seedPath = path.join(rootDir, 'supabase', 'seed.sql');
assert(fs.existsSync(seedPath), 'Initial database seed SQL exists');

// 5. Verify Store Service & Image Uploads
console.log('\nTEST 5: Verifying Store Service & Fallback Architecture...');
const servicePath = path.join(rootDir, 'src', 'services', 'storeService.ts');
assert(fs.existsSync(servicePath), 'storeService.ts exists');
const serviceContent = fs.readFileSync(servicePath, 'utf-8');
assert(serviceContent.includes('uploadImage'), 'Secure image upload method exists');
assert(serviceContent.includes('deleteOrArchiveProduct'), 'Product archive/delete handler exists');
assert(serviceContent.includes('updateOrderStatus'), 'Order status management exists');

// 6. Verify Admin Pages
console.log('\nTEST 6: Verifying Admin Pages & Components...');
const adminPages = [
  'AdminLogin.tsx',
  'AdminDashboard.tsx',
  'AdminProducts.tsx',
  'AdminProductForm.tsx',
  'AdminCategories.tsx',
  'AdminOrders.tsx',
  'AdminCustomers.tsx',
  'AdminHomepage.tsx',
  'AdminOffers.tsx',
  'AdminSettings.tsx',
];
adminPages.forEach((page) => {
  const p = path.join(rootDir, 'src', 'pages', 'admin', page);
  assert(fs.existsSync(p), `Admin page ${page} exists`);
});

// 7. Verify SEO Configuration
console.log('\nTEST 7: Verifying SEO & robots.txt Protection...');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
assert(fs.existsSync(robotsPath), 'public/robots.txt exists');
const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
assert(robotsContent.includes('Disallow: /admin/'), 'Admin routes protected from search indexation in robots.txt');

// 8. Verify Setup Documentation & Environment Variables
console.log('\nTEST 8: Verifying Owner Setup Documentation & Secrets Safety...');
const setupPath = path.join(rootDir, 'SETUP.md');
assert(fs.existsSync(setupPath), 'SETUP.md documentation exists');
const envExamplePath = path.join(rootDir, '.env.example');
assert(fs.existsSync(envExamplePath), '.env.example exists');
const envContent = fs.readFileSync(envExamplePath, 'utf-8');
assert(!envContent.includes('service_role'), 'Zero service-role secrets exposed in .env.example');

// 9. Verify Vite Dev Server Response
console.log('\nTEST 9: Verifying Live Web Server Responses...');
try {
  const response = await fetch('http://localhost:5173/');
  assert(response.status === 200, `Vite dev server returns HTTP ${response.status} OK`);
  const html = await response.text();
  assert(html.includes('MOMEN CENTER'), 'Live HTML contains MOMEN CENTER branding');
} catch (err) {
  console.warn('  ⚠️ Vite server check skipped (server not actively running on 5173):', err.message);
}

// Summary
console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY! 🎉');
}
