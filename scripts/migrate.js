const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:postgres@localhost:5432/money_tracker';

const pool = new Pool({ connectionString });

async function runMigrate() {
  const isDown = process.argv.includes('--down') || process.argv.includes('--rollback');
  const client = await pool.connect();

  console.log(`\n======================================================`);
  console.log(`📦 [DATABASE MIGRATION] Mode: ${isDown ? 'ROLLBACK (DOWN)' : 'MIGRATE (UP)'}`);
  console.log(`🔗 Target: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`======================================================\n`);

  try {
    if (isDown) {
      const downFile = path.join(__dirname, '..', 'db', 'migrations', '001_create_schema.down.sql');
      if (fs.existsSync(downFile)) {
        console.log(`⏳ Menjalankan rollback: 001_create_schema.down.sql...`);
        const sql = fs.readFileSync(downFile, 'utf-8');
        await client.query(sql);
        console.log(`✅ [BERHASIL] Semua tabel dan indeks berhasil di-rollback.`);
      } else {
        console.error(`❌ File rollback ${downFile} tidak ditemukan.`);
      }
      return;
    }

    // 1. Ensure schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Read all .sql files in db/migrations (excluding .down.sql)
    const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql') && !file.includes('.down.'))
      .sort();

    // 3. Check already applied migrations
    const res = await client.query('SELECT version FROM schema_migrations');
    const appliedVersions = new Set(res.rows.map((r) => r.version));

    let executedCount = 0;
    for (const file of files) {
      const version = file.split('_')[0];
      if (appliedVersions.has(version)) {
        console.log(`⏩ [TERAPLIKASI] ${file} (dilewati)`);
        continue;
      }

      console.log(`⏳ [MENJALANKAN] Menerapkan ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, name) VALUES ($1, $2)',
          [version, file]
        );
        await client.query('COMMIT');
        console.log(`✅ [SUKSES] ${file} berhasil diterapkan.`);
        executedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ [GAGAL] Terjadi kesalahan saat migrasi ${file}:`, err);
        throw err;
      }
    }

    if (executedCount === 0) {
      console.log(`\n✨ Database sudah up-to-date. Tidak ada migrasi baru.`);
    } else {
      console.log(`\n🎉 Selesai! Sebanyak ${executedCount} file migrasi berhasil dieksekusi.`);
    }
  } catch (error) {
    console.error('\n❌ Gagal menjalankan migrasi:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrate();
