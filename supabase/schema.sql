-- ==============================================================================
-- KASIR POS KAGE46 - SUPABASE (POSTGRESQL) DATABASE SCHEMA
-- Jalankan skrip ini langsung di menu SQL Editor pada Dashboard Supabase Anda
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL USERS / KASIR & OWNER (MANAJEMEN AKUN)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'cashier')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL INGREDIENTS (DATABASE BAHAN BAKU GUDANG)
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('gr', 'ml', 'pcs', 'pack')),
    current_stock NUMERIC(12, 2) NOT NULL DEFAULT 0,
    min_stock_alert NUMERIC(12, 2) NOT NULL DEFAULT 10,
    package_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    package_size NUMERIC(12, 2) NOT NULL DEFAULT 1,
    unit_cost NUMERIC(14, 4) NOT NULL DEFAULT 0, -- Modal per satuan unit terkecil
    last_restocked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL PRODUCTS & RESEP HPP
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    cost_price NUMERIC(14, 2) NOT NULL DEFAULT 0, -- Total HPP (Bahan + Sewa Tempat + Kemasan)
    raw_material_cost NUMERIC(14, 2) DEFAULT 0,   -- Khusus bahan baku resep
    overhead_cost NUMERIC(14, 2) DEFAULT 0,       -- Alokasi sewa tempat & operasional per porsi
    packaging_cost NUMERIC(14, 2) DEFAULT 0,      -- Biaya cup & kemasan per porsi
    stock INT NOT NULL DEFAULT 99,
    min_stock_alert INT DEFAULT 10,
    is_quick_item BOOLEAN DEFAULT FALSE,
    has_recipe BOOLEAN DEFAULT FALSE,
    recipe JSONB DEFAULT '[]'::jsonb,             -- Komposisi takaran bahan baku
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL ORDERS & TRANSAKSI POS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'takeaway')),
    table_number VARCHAR(30),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(50),
    cashier_name VARCHAR(100) NOT NULL,
    items JSONB NOT NULL, -- Array item yang dibeli
    subtotal NUMERIC(14, 2) NOT NULL,
    discount_nominal NUMERIC(14, 2) DEFAULT 0,
    tax_nominal NUMERIC(14, 2) DEFAULT 0,
    total NUMERIC(14, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'qris', 'transfer', 'card')),
    amount_paid NUMERIC(14, 2) NOT NULL,
    change_amount NUMERIC(14, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'open_bill', 'void')),
    void_reason TEXT,
    voided_at TIMESTAMPTZ,
    restored_stock BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL SHIFTS KASIR
CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cashier_name VARCHAR(100) NOT NULL,
    starting_cash NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_cash_sales NUMERIC(14, 2) DEFAULT 0,
    total_non_cash_sales NUMERIC(14, 2) DEFAULT 0,
    total_expenses NUMERIC(14, 2) DEFAULT 0,
    expected_cash NUMERIC(14, 2) DEFAULT 0,
    actual_cash NUMERIC(14, 2),
    cash_difference NUMERIC(14, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    notes TEXT,
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- 7. TABEL EXPENSES (PENGELUARAN KAS OPERASIONAL)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    source VARCHAR(30) NOT NULL CHECK (source IN ('cash_drawer', 'bank_transfer')),
    cashier_name VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
);

-- 8. TABEL CUSTOMERS (CRM LOYALITAS)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100),
    points INT DEFAULT 0,
    total_visits INT DEFAULT 1,
    total_spend NUMERIC(14, 2) DEFAULT 0,
    last_visit TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL STOCK OPNAMES (LOG PENYESUAIAN STOK GUDANG)
CREATE TABLE IF NOT EXISTS stock_opnames (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE SET NULL,
    ingredient_name VARCHAR(150) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    system_stock NUMERIC(12, 2) NOT NULL,
    actual_stock NUMERIC(12, 2) NOT NULL,
    difference NUMERIC(12, 2) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    recorded_by VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
);

-- 10. TABEL STORE SETTINGS
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name VARCHAR(100) NOT NULL,
    tagline VARCHAR(150),
    address TEXT,
    phone VARCHAR(50),
    instagram VARCHAR(50),
    tiktok VARCHAR(50),
    wifi_name VARCHAR(50),
    wifi_password VARCHAR(50),
    tax_percentage NUMERIC(5, 2) DEFAULT 10,
    tax_enabled BOOLEAN DEFAULT FALSE,
    receipt_size VARCHAR(10) DEFAULT '58mm',
    receipt_footer_message TEXT,
    qris_merchant_name VARCHAR(100),
    bank_account JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INITIAL SEED DATA (DATA AWAL SUPABASE)
-- ==============================================================================

-- Akun Default Owner & Kasir
INSERT INTO users (username, password, name, role, is_active)
VALUES 
    ('owner', 'kage46owner', 'Owner KAGE46', 'owner', true),
    ('kasir1', 'kasir123', 'Rizky Ramadhan', 'cashier', true),
    ('kasir2', 'kasir123', 'Siti Barista', 'cashier', true)
ON CONFLICT (username) DO NOTHING;

-- Profil Toko Default
INSERT INTO settings (id, store_name, tagline, address, phone, instagram, tiktok, wifi_name, wifi_password, tax_percentage, tax_enabled, receipt_size, receipt_footer_message, qris_merchant_name, bank_account)
VALUES (
    1,
    'KAGE46 Specialty Coffee & Kitchen',
    'Specialty Coffee, Artisan Roastery & Daily Kitchen',
    'Jl. Boulevard Raya Barat No. 46, Kebayoran Baru, Jakarta Selatan',
    '0812-9876-4646',
    '@kage46.coffee',
    '@kage46coffee',
    'KAGE46-FREE-WIFI',
    'kopikage46enak',
    10.0,
    false,
    '58mm',
    'Terima kasih telah berkunjung ke KAGE46!\nNikmati hari Anda dengan secangkir kopi terbaik.',
    'KAGE46 SPECIALTY COFFEE - NMID: ID1020304050',
    '{"bankName": "Bank BCA", "accountNumber": "8415-0922-46", "holderName": "PT KAGE EMPAT ENAM INDONESIA"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Buka akses publik untuk kemudahan integrasi Web POS
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_opnames ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read/write users" ON users FOR ALL USING (true);
CREATE POLICY "Allow anon read/write ingredients" ON ingredients FOR ALL USING (true);
CREATE POLICY "Allow anon read/write products" ON products FOR ALL USING (true);
CREATE POLICY "Allow anon read/write orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow anon read/write shifts" ON shifts FOR ALL USING (true);
CREATE POLICY "Allow anon read/write expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow anon read/write customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow anon read/write stock_opnames" ON stock_opnames FOR ALL USING (true);
CREATE POLICY "Allow anon read/write settings" ON settings FOR ALL USING (true);
