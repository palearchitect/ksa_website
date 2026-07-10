/**
 * Database Migrations System
 * 
 * This script handles all database schema migrations.
 * Run with: node backend/migrations/init.js
 * 
 * Migrations are automatically applied in order on server startup.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const migrations = [
  {
    name: '001-create-users-table',
    up: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `,
    down: `DROP TABLE IF EXISTS users;`
  },
  {
    name: '002-create-properties-table',
    up: `
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        image TEXT,
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        price NUMERIC NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'sale',
        type TEXT,
        bedrooms INTEGER,
        bathrooms INTEGER,
        square_footage INTEGER,
        description TEXT,
        featured BOOLEAN NOT NULL DEFAULT false,
        tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_properties_status ON properties (status);
      CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties (featured);
    `,
    down: `DROP TABLE IF EXISTS properties;`
  },
  {
    name: '003-create-projects-table',
    up: `
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        image TEXT,
        description TEXT,
        status TEXT NOT NULL,
        type TEXT NOT NULL,
        total_units INTEGER,
        completion_percentage INTEGER DEFAULT 0,
        start_date DATE,
        expected_completion DATE,
        budget NUMERIC DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
      CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured);
    `,
    down: `DROP TABLE IF EXISTS projects;`
  },
  {
    name: '004-create-bookings-table',
    up: `
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        property_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        booking_date DATE NOT NULL,
        booking_time TEXT NOT NULL,
        guests INTEGER NOT NULL DEFAULT 1,
        notes TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (booking_date, booking_time);
      CREATE INDEX IF NOT EXISTS idx_bookings_property_date_time ON bookings (property_id, booking_date, booking_time);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_slot ON bookings (property_id, booking_date, booking_time);
    `,
    down: `DROP TABLE IF EXISTS bookings;`
  },
  {
    name: '005-create-contact-messages-table',
    up: `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (email);
    `,
    down: `DROP TABLE IF EXISTS contact_messages;`
  },
  {
    name: '006-create-migrations-table',
    up: `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
    down: `DROP TABLE IF EXISTS migrations;`
  },
  {
    name: '007-add-check-constraints-and-audit-logs',
    up: `
      -- Add constraints to properties if they don't exist
      ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_properties_price;
      ALTER TABLE properties ADD CONSTRAINT chk_properties_price CHECK (price >= 0);

      -- Add constraints to projects
      ALTER TABLE projects DROP CONSTRAINT IF EXISTS chk_projects_completion;
      ALTER TABLE projects ADD CONSTRAINT chk_projects_completion CHECK (completion_percentage BETWEEN 0 AND 100);
      
      ALTER TABLE projects DROP CONSTRAINT IF EXISTS chk_projects_budget;
      ALTER TABLE projects ADD CONSTRAINT chk_projects_budget CHECK (budget >= 0);

      -- Create audit_logs table
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_email TEXT,
        action TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        before_data JSONB,
        after_data JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs (table_name, record_id);
    `,
    down: `
      ALTER TABLE properties DROP CONSTRAINT IF EXISTS chk_properties_price;
      ALTER TABLE projects DROP CONSTRAINT IF EXISTS chk_projects_completion;
      ALTER TABLE projects DROP CONSTRAINT IF EXISTS chk_projects_budget;
      DROP TABLE IF EXISTS audit_logs;
    `
  },
  {
    name: '008-create-hero-slides-table',
    up: `
      CREATE TABLE IF NOT EXISTS hero_slides (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        title TEXT NOT NULL,
        tagline TEXT,
        cta_text TEXT DEFAULT 'Explore Properties',
        cta_link TEXT DEFAULT '/properties',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `,
    down: `DROP TABLE IF EXISTS hero_slides;`
  },
  {
    name: '009-create-leases-table',
    up: `
      CREATE TABLE IF NOT EXISTS leases (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
        owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        unit_description TEXT,
        rent_amount NUMERIC NOT NULL DEFAULT 0,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_leases_tenant ON leases (tenant_id);
      CREATE INDEX IF NOT EXISTS idx_leases_property ON leases (property_id);
      CREATE INDEX IF NOT EXISTS idx_leases_owner ON leases (owner_id);
      CREATE INDEX IF NOT EXISTS idx_leases_status ON leases (status);
    `,
    down: `DROP TABLE IF EXISTS leases;`
  },
  {
    name: '010-create-maintenance-tickets-table',
    up: `
      CREATE TABLE IF NOT EXISTS maintenance_tickets (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lease_id INTEGER REFERENCES leases(id) ON DELETE SET NULL,
        property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        priority TEXT NOT NULL DEFAULT 'medium',
        status TEXT NOT NULL DEFAULT 'open',
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        resolution_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_tickets_tenant ON maintenance_tickets (tenant_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON maintenance_tickets (status);
      CREATE INDEX IF NOT EXISTS idx_tickets_property ON maintenance_tickets (property_id);
    `,
    down: `DROP TABLE IF EXISTS maintenance_tickets;`
  },
  {
    name: '011-create-payments-table',
    up: `
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lease_id INTEGER REFERENCES leases(id) ON DELETE SET NULL,
        reference TEXT UNIQUE NOT NULL,
        amount NUMERIC NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'NGN',
        status TEXT NOT NULL DEFAULT 'pending',
        payment_type TEXT NOT NULL DEFAULT 'rent',
        provider TEXT NOT NULL DEFAULT 'paystack',
        provider_response JSONB,
        paid_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_reference ON payments (reference);
      CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments (tenant_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
    `,
    down: `DROP TABLE IF EXISTS payments;`
  },
  {
    name: '012-create-owner-property-table',
    up: `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
      
      CREATE TABLE IF NOT EXISTS owner_property (
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        PRIMARY KEY (owner_id, property_id)
      );
      CREATE INDEX IF NOT EXISTS idx_owner_property_owner ON owner_property (owner_id);
      CREATE INDEX IF NOT EXISTS idx_owner_property_property ON owner_property (property_id);
    `,
    down: `
      DROP TABLE IF EXISTS owner_property;
      ALTER TABLE users DROP COLUMN IF EXISTS google_id;
    `
  },
  {
    name: '013-clear-demo-users',
    up: `
      DELETE FROM users WHERE role != 'admin' OR email NOT IN ('admin@ksavaluers.com');
    `,
    down: `/* No-op */`
  }
];

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Starting database migrations...\n');
    
    // Create migrations table first if it doesn't exist
    const migrationsTableSetup = migrations.find(m => m.name === '006-create-migrations-table');
    await client.query(migrationsTableSetup.up);
    
    for (const migration of migrations) {
      const result = await client.query(
        'SELECT * FROM migrations WHERE name = $1',
        [migration.name]
      );
      
      if (result.rows.length === 0) {
        console.log(`⬆️  Running migration: ${migration.name}`);
        await client.query(migration.up);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migration.name]
        );
        console.log(`✅ Migration applied: ${migration.name}\n`);
      } else {
        console.log(`⏭️  Skipped (already applied): ${migration.name}\n`);
      }
    }
    
    console.log('✨ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { runMigrations, migrations };
