const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:postgres@localhost:5432/money_tracker';

const pool = new Pool({ connectionString });

async function runSeed() {
  const isFresh = process.argv.includes('--fresh') || process.argv.includes('--clean');
  const client = await pool.connect();

  console.log(`\n======================================================`);
  console.log(`🌱 [DATABASE SEEDER] Mode: ${isFresh ? 'FRESH SEED (Bersihkan data lama)' : 'NORMAL SEED (On Conflict Ignore/Update)'}`);
  console.log(`🔗 Target: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`======================================================\n`);

  try {
    if (isFresh) {
      console.log(`🧹 Membersihkan tabel yang ada (TRUNCATE CASCADE)...`);
      await client.query(`
        TRUNCATE TABLE transactions, goals, custom_categories, daily_quests CASCADE;
      `);
      console.log(`✅ Data transaksi, target, kategori kustom, dan quest berhasil dikosongkan.`);
    }

    const seedersDir = path.join(__dirname, '..', 'db', 'seeders');
    const files = fs
      .readdirSync(seedersDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`⏳ [MENJALANKAN] Seeding dari ${file}...`);
      const filePath = path.join(seedersDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`✅ [SUKSES] ${file} berhasil diinjeksikan ke database.`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ [GAGAL] Error saat mengeksekusi seeder ${file}:`, err);
        throw err;
      }
    }

    // Report Summary
    const stats = await client.query('SELECT name, level, streak_days, monthly_budget FROM user_stats WHERE id = $1', ['current_user']);
    const txCount = await client.query('SELECT COUNT(*) FROM transactions');
    const goalsCount = await client.query('SELECT COUNT(*) FROM goals');
    const catCount = await client.query('SELECT COUNT(*) FROM custom_categories');
    const questCount = await client.query('SELECT COUNT(*) FROM daily_quests');

    console.log(`\n📊 Ringkasan Data Database Saat Ini:`);
    if (stats.rowCount > 0) {
      const u = stats.rows[0];
      console.log(`   - Profil Pengguna: ${u.name} (Level ${u.level}, Streak ${u.streak_days} hari, Budget Rp ${Number(u.monthly_budget).toLocaleString('id-ID')})`);
    }
    console.log(`   - Total Transaksi      : ${txCount.rows[0].count} data`);
    console.log(`   - Total Target Tabungan: ${goalsCount.rows[0].count} data`);
    console.log(`   - Total Kategori Kustom: ${catCount.rows[0].count} data`);
    console.log(`   - Total Misi Harian    : ${questCount.rows[0].count} data`);
    console.log(`\n🎉 Proses Seeding Selesai dengan Sukses!\n`);
  } catch (error) {
    console.error('\n❌ Gagal menjalankan seeder:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
