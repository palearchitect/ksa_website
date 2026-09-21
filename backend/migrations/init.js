/**
 * Database Migrations System
 * 
 * This script handles all database schema migrations.
 * Run with: node backend/migrations/init.js
 * 
 * Migrations are automatically applied in order on server startup.
 */

const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const envPaths = [
  path.join(__dirname, '..', '..', '.env.local'),
  path.join(__dirname, '..', '..', '.env'),
  path.join(__dirname, '..', '.env.local'),
  path.join(__dirname, '..', '.env'),
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), '.env')
];
envPaths.forEach(p => { if (fs.existsSync(p)) require('dotenv').config({ path: p, override: true }); });
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: dbUrl,
  ssl: dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1')
    ? { rejectUnauthorized: false }
    : false,
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
  },
  {
    name: '014-revamp-and-content-tables',
    up: `
      -- Add soft deletes to users
      ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
      
      -- Add cryptographic hash to audit logs
      ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS hash TEXT;

      -- Create team_members table
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        tag TEXT,
        image_url TEXT,
        description TEXT,
        email TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );

      -- Create faqs table
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );

      -- Seed team members
      INSERT INTO team_members (id, name, role, tag, image_url, description, email) VALUES
      (1, 'ESV. Markson Ajiboye', 'Head Business Unit', 'Certified Estate Surveyor & Valuer', 'IMG-20240405-WA0009-233x300.jpg', 'With extensive experience in real estate, Markson leads our agency and sales division. His expertise ensures optimal property valuations and successful client transactions across major Nigerian markets.', 'info@ksavaluers.com'),
      (2, 'Eniola Abiola Kayode', 'Human Resource Manager', 'HR Specialist', 'IMG-20240405-WA0011-e1712320368546-300x268.jpg', 'A dynamic HR professional skilled in recruitment, employee relations, training, and development. Eniola ensures our team maintains the highest standards of professionalism and client service.', 'info@ksavaluers.com'),
      (3, 'ESV Akinyele Abiodun', 'Head of Estate Management & Valuation', 'Estate Surveyor', 'DSC00129-240x300.jpeg', 'A seasoned estate surveyor with strong problem-solving and communication skills. Akinyele specializes in property valuation, estate management, and ensuring compliance with regulatory standards.', 'abiodun@ksavaluers.com'),
      (4, 'ESV Olaoluwa Isaac Ojewumi', 'Head of Sales Department', 'Sales & Agency Expert', 'DSC00141-scaled.jpeg', 'Experienced in real estate sales and agency leadership. Olaoluwa drives our sales initiatives with strategic market insights and exceptional client relationship management.', 'olaoluwaisaac@ksavaluers.com')
      ON CONFLICT (id) DO NOTHING;

      -- Seed FAQs
      INSERT INTO faqs (id, category, question, answer, sort_order) VALUES
      (1, 'general', 'Who are Kayode Segun & Associates (KSA Valuers)?', 'KSA Valuers is a premier property valuation and real estate consulting firm in Nigeria. We serve as professional intermediaries between property owners and tenants, specializing in property valuation, estate management, lease renewals, and sales agency services. Our team consists of certified estate surveyors and valuers with extensive industry experience.', 10),
      (2, 'general', 'What services do you provide?', 'We offer comprehensive property solutions including: 1) Property Valuation & Appraisal, 2) Estate Management & Administration, 3) Lease Renewal & Rent Collection, 4) Property Sales & Agency, 5) Construction Cost Consulting, 6) Property Investment Advisory, 7) Tenancy Agreement Documentation, and 8) Property Market Research.', 20),
      (3, 'general', 'Are your valuers professionally certified?', 'Yes, all our valuers are certified members of the Nigerian Institution of Estate Surveyors and Valuers (NIESV). Our team includes Estate Surveyors and Valuers (ESV) with valid practicing licenses, ensuring compliance with professional standards and regulations.', 30),
      (4, 'general', 'Which areas in Nigeria do you serve?', 'While our main office is in Lagos, we provide services across Nigeria including Abuja, Port Harcourt, Ibadan, and other major cities. We have a network of professional partners that enables us to serve clients nationwide with consistent quality and professionalism.', 40),
      (5, 'property', 'How do you handle lease renewals?', 'We proactively monitor lease expiration dates and initiate renewal discussions 3-4 months before expiry. We conduct market research to determine current rental rates, negotiate favorable terms for our clients, prepare renewal documentation, and ensure all parties comply with the renewed agreement.', 50),
      (6, 'property', 'What happens if tenants default on payments?', 'We implement a structured approach: 1) Immediate communication with the tenant, 2) Formal demand notice issuance, 3) Mediation and payment plan negotiation, 4) Legal proceedings if necessary, and 5) Tenant replacement as a last resort. We maintain strict compliance with tenancy laws throughout the process.', 60),
      (7, 'property', 'Do you handle property maintenance and repairs?', 'Yes, we coordinate all aspects of property maintenance including regular inspections, obtaining repair quotes, supervising contractors, and ensuring quality workmanship. We maintain a network of trusted service providers and manage repair budgets efficiently.', 70),
      (8, 'property', 'How do you ensure tenant quality and reliability?', 'We conduct comprehensive tenant screening including employment verification, credit checks, previous landlord references, and personal interviews. Our rigorous vetting process minimizes risk and ensures we select responsible tenants who will maintain the property properly and pay rent consistently.', 80),
      (9, 'valuation', 'Do you provide official valuation reports?', 'Yes, we provide professionally prepared valuation reports that are accepted by banks, government agencies, and courts. Our reports include detailed property analysis, comparable market data, valuation methodology explanation, and certified valuer signatures.', 90),
      (10, 'valuation', 'How do you determine property value?', 'We use multiple valuation methods including comparative analysis, income capitalization, and cost approach. Factors considered include location, property condition, market trends, infrastructure development, comparable sales data, and economic indicators. Our valuations follow international standards and Nigerian regulatory requirements.', 100),
      (11, 'valuation', 'How long does the valuation process take?', 'Standard residential valuations are completed within 3-5 business days after property inspection. Commercial and industrial properties may require 7-10 business days due to complexity. Emergency valuations with expedited service are available at an additional cost.', 110),
      (12, 'valuation', 'What documents do I need for property valuation?', 'Required documents include: 1) Proof of ownership (Title/C of O), 2) Recent utility bills, 3) Survey plan, 4) Building approval plans, 5) Recent photographs, 6) Tenancy agreements (if rented), and 7) Any previous valuation reports. We can advise on specific requirements based on property type.', 120),
      (13, 'support', 'How can I contact your team?', 'You can reach us through: Phone: +234 905 390 1001 / +234 905 389 8636, Email: kayodesegunandassociates@gmail.com, Office: Suite J260, Road 5, Ikota Shopping Complex, Ajah, Lekki, Lagos. We also offer online contact forms on our website and live chat support during business hours.', 130),
      (14, 'support', 'Do you offer consultation before engagement?', 'Yes, we provide free initial consultations to understand your needs and explain our services. During this consultation, we assess your property situation, answer your questions, and provide preliminary advice without any obligation to engage our services.', 140),
      (15, 'support', 'What are your business hours?', 'Our office hours are Monday to Friday: 8:00 AM to 6:00 PM, Saturday: 9:00 AM to 2:00 PM. Emergency services are available outside these hours for urgent matters. Online inquiries via our website are monitored 24/7.', 150),
      (16, 'support', 'How quickly do you respond to inquiries?', 'We aim to respond to all inquiries within 2 business hours during office hours. Email queries receive responses within 24 hours. Urgent matters can be addressed immediately through our phone lines. We pride ourselves on prompt and professional communication.', 160),
      (17, 'legal', 'Are your tenancy agreements legally binding?', 'Yes, all our tenancy agreements are prepared by legal professionals and comply with Nigerian tenancy laws. They include all necessary clauses to protect both landlord and tenant rights, and are regularly updated to reflect current legislation and court rulings.', 170),
      (18, 'legal', 'Do you handle property title verification?', 'Yes, we conduct thorough title searches and verification through appropriate government agencies to confirm property ownership and identify any encumbrances or legal issues. This service is crucial for property transactions to prevent future legal disputes.', 180),
      (19, 'legal', 'What legal protection do you provide to clients?', 'We maintain professional indemnity insurance and work closely with legal partners to ensure client protection. Our services include proper documentation, compliance with regulations, dispute resolution assistance, and legal representation when necessary through our network of legal professionals.', 190),
      (20, 'legal', 'Can you help with property dispute resolution?', 'Yes, we provide mediation and dispute resolution services for property-related conflicts including tenant-landlord disputes, boundary issues, ownership conflicts, and contract disagreements. We aim for amicable resolution but can recommend legal action when necessary.', 200)
      ON CONFLICT (id) DO NOTHING;
      
      -- Reset serial sequence counters
      SELECT setval(pg_get_serial_sequence('team_members', 'id'), COALESCE(MAX(id), 1)) FROM team_members;
      SELECT setval(pg_get_serial_sequence('faqs', 'id'), COALESCE(MAX(id), 1)) FROM faqs;
    `,
    down: `
      DROP TABLE IF EXISTS team_members;
      DROP TABLE IF EXISTS faqs;
      ALTER TABLE users DROP COLUMN IF EXISTS deleted_at;
      ALTER TABLE audit_logs DROP COLUMN IF EXISTS hash;
    `
  },
  {
    name: '015-add-otp-fields',
    up: `
      ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ;
    `,
    down: `
      ALTER TABLE users DROP COLUMN IF EXISTS otp_code;
      ALTER TABLE users DROP COLUMN IF EXISTS otp_expires_at;
    `
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
