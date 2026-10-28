-- Seeder: 001_initial_seeds.sql
-- Description: Seeds initial dummy/demo data for Money Tracker

-- 1. Seed User Stats
INSERT INTO user_stats (id, name, title, level, current_xp, xp_to_next_level, streak_days, last_active_date, monthly_budget)
VALUES (
    'current_user',
    'Alex Pratama',
    'Pengatur Bijak (Level 12)',
    12,
    750,
    1000,
    12,
    '2026-10-28',
    7000000
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    level = EXCLUDED.level,
    current_xp = EXCLUDED.current_xp,
    xp_to_next_level = EXCLUDED.xp_to_next_level,
    streak_days = EXCLUDED.streak_days,
    last_active_date = EXCLUDED.last_active_date,
    monthly_budget = EXCLUDED.monthly_budget,
    updated_at = CURRENT_TIMESTAMP;

-- 2. Seed Custom Categories
INSERT INTO custom_categories (id, name, type) VALUES
    ('cat-seed-1', 'Investasi & Saham', 'expense'),
    ('cat-seed-2', 'Kesehatan & Medis', 'expense'),
    ('cat-seed-3', 'Pendidikan & Kursus', 'expense'),
    ('cat-seed-4', 'Freelance & Side Project', 'income'),
    ('cat-seed-5', 'Dividen & Passive Income', 'income')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Transactions
INSERT INTO transactions (id, title, amount, type, category, date, xp_earned) VALUES
    -- Income
    ('tx-1', 'Gaji Pokok Bulanan', 9500000, 'income', 'Gaji & Usaha', '2026-10-27', 50),
    ('tx-2', 'Bonus Project UI/UX App', 3000000, 'income', 'Freelance & Side Project', '2026-10-26', 50),
    ('tx-3', 'Hasil Penjualan Aset Crypto & Saham', 1250000, 'income', 'Dividen & Passive Income', '2026-10-24', 40),
    ('tx-4', 'Honor Narasumber Workshop Digital', 750000, 'income', 'Gaji & Usaha', '2026-10-22', 35),
    
    -- Expenses
    ('tx-5', 'Makan Siang Nasi Padang & Es Kopi', 38000, 'expense', 'Makanan & Minuman', '2026-10-28', 25),
    ('tx-6', 'Bensin Motor Pertamax Full Tank', 45000, 'expense', 'Transportasi', '2026-10-27', 25),
    ('tx-7', 'Belanja Mingguan Sayur & Buah Superindo', 320000, 'expense', 'Belanja', '2026-10-26', 25),
    ('tx-8', 'Bayar Tagihan Listrik PLN & IndiHome', 680000, 'expense', 'Tagihan & Utilitas', '2026-10-25', 30),
    ('tx-9', 'Langganan Netflix & Spotify Family', 186000, 'expense', 'Hiburan', '2026-10-24', 25),
    ('tx-10', 'Beli Buku Atomic Habits & Notebook', 145000, 'expense', 'Pendidikan & Kursus', '2026-10-23', 25),
    ('tx-11', 'Top Up Reksadana Pasar Uang Bibit', 500000, 'expense', 'Investasi & Saham', '2026-10-21', 35),
    ('tx-12', 'Beli Vitamin C & Suplemen Kesehatan', 95000, 'expense', 'Kesehatan & Medis', '2026-10-20', 25)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Goals
INSERT INTO goals (id, title, target_amount, current_amount, category, is_main) VALUES
    ('goal-1', 'Beli Nintendo Switch OLED', 4500000, 3375000, 'Gadget Impian', TRUE),
    ('goal-2', 'Dana Darurat 3 Bulan', 10000000, 6500000, 'Tabungan Aman', FALSE),
    ('goal-3', 'Liburan Akhir Tahun ke Jepang', 15000000, 4500000, 'Liburan', FALSE),
    ('goal-4', 'Upgrade Monitor & Ergonomic Chair', 5500000, 1800000, 'Setup Kerja', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Daily Quests
INSERT INTO daily_quests (id, title, description, xp_reward, completed, claimed) VALUES
    ('quest-1', 'Catat Pengeluaran Pertama Hari Ini', 'Bantu Wally mendata arus kas harianmu', 25, TRUE, TRUE),
    ('quest-2', 'Hemat Pengeluaran Harian (< Rp 50.000)', 'Tahan belanja impulsif hari ini', 50, TRUE, FALSE),
    ('quest-3', 'Setor Tabungan ke Celengan Target', 'Sisihkan minimal Rp 50.000 untuk target impian', 40, FALSE, FALSE),
    ('quest-4', 'Review Anggaran Mingguan', 'Periksa sisa kuota budget bulan ini', 30, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Users (Admin & Standard Demo User)
-- Password for admin: admin123
-- Password for user: user123
INSERT INTO users (id, username, password_hash, name, role, gender, age) VALUES
    (
        'user-admin',
        'admin',
        '6a0431de7cd94e2ec53e66d58534603f:12b239ac582fdb7996024749756772a637dc55ccf24a496743017f94bcb009728db345ec2a90fb9995795d3292dd45108f1bfccff38dbb24d116e7bd2fc46bb7',
        'Administrator Money Tracker',
        'admin',
        'pria',
        28
    ),
    (
        'user-demo',
        'alex',
        '6dc8c06ec60352545b7e177e6a5d5842:7882fd9669a4f1b49c66228034168bea6b02410930467ab432a26b980b9a158d7dd3ab4cdd7014ddb2b8df7362f591900a035758746dc736f598876b96a0b550',
        'Alex Pratama',
        'user',
        'pria',
        22
    )
ON CONFLICT (id) DO NOTHING;
