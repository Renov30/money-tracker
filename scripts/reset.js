const { execSync } = require('child_process');

console.log(`\n======================================================`);
console.log(`🔄 [DATABASE RESET] Mereset & Membangun Ulang Seluruh Database...`);
console.log(`======================================================\n`);

try {
  console.log(`1️⃣ Menjalankan Rollback Schema...`);
  execSync('node --env-file=.env.local scripts/migrate.js --down', { stdio: 'inherit' });

  console.log(`\n2️⃣ Menjalankan Migrasi Schema Baru...`);
  execSync('node --env-file=.env.local scripts/migrate.js', { stdio: 'inherit' });

  console.log(`\n3️⃣ Menginjeksi Data Seeder...`);
  execSync('node --env-file=.env.local scripts/seed.js', { stdio: 'inherit' });

  console.log(`\n🌟 Database berhasil di-reset, dimigrasikan, dan di-seed dengan sukses!\n`);
} catch (error) {
  console.error(`\n❌ Terjadi kesalahan saat reset database:`, error.message);
  process.exit(1);
}
