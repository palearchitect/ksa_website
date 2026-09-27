/**
 * Database Seed Script
 * 
 * Populates the database with initial admin user and sample data.
 * Run with: node backend/scripts/seed.js
 */

const path = require('path');
const fs = require('fs');

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');


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

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Seed admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMeNow_123';
    const adminHash = await bcrypt.hash(adminPassword, 12);
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ksavaluers.com';
    
    const existingAdmin = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingAdmin.rows.length === 0) {
      await client.query(
        `INSERT INTO users (email, password_hash, role, name, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [adminEmail, adminHash, 'admin', 'Admin User', 'active']
      );
      console.log(`✅ Seeded default admin user: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}\n`);
    } else {
      console.log(`⏭️  Admin user already exists: ${adminEmail}\n`);
    }
    
    // Seed sample properties
    const existingProperties = await client.query('SELECT COUNT(*) FROM properties');
    if (existingProperties.rows[0].count == 0) {
      const sampleProperties = [
        {
          title: '25th Apartments (25th Apartment)',
          location: 'Olu-Akinbola Drive, Off SPG Road, Igbo-Efon, Off Lekki-Epe Expressway, Lekki, Eti-Osa L.G.A., Lagos State',
          image: '/images/25th-apartment/25th-apartment-1.jpg',
          images: [
            '/images/25th-apartment/25th-apartment-1.jpg',
            '/images/25th-apartment/25th-apartment-living.jpg',
            '/images/25th-apartment/25th-apartment-bedroom.jpg',
            '/images/25th-apartment/25th-apartment-kitchen.jpg',
            '/images/25th-apartment/25th-apartment-pool.jpg',
            '/images/25th-apartment/25th-apartment-2.jpg',
            '/images/25th-apartment/25th-apartment-3.jpg'
          ],
          price: 150000000,
          status: 'sale',
          type: 'Apartment',
          bedrooms: 2,
          bathrooms: 3,
          square_footage: 180,
          description: '25th Apartments is a premier luxury development located on Olu-Akinbola Drive, Off SPG Road, Igbo-Efon, Lekki. Developed by Kayode Segun & Associates, this modern 4-story architectural landmark comprises 9 units of 2-bedroom luxury apartments and 1 unit of a 1-bedroom apartment with C of O, fitted kitchen, gym, swimming pool, and 24/7 security.',
          featured: true,
          tags: ['25th Apartments', 'Lekki', 'Luxury Apartment', 'Now Selling', 'C of O', 'Pool & Gym']
        }
      ];
      
      for (const prop of sampleProperties) {
        await client.query(
          `INSERT INTO properties (title, location, image, images, price, status, type, bedrooms, bathrooms, square_footage, description, featured, tags)
           VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)`,
          [prop.title, prop.location, prop.image, JSON.stringify(prop.images), prop.price, prop.status, prop.type, prop.bedrooms, prop.bathrooms, prop.square_footage, prop.description, prop.featured, JSON.stringify(prop.tags)]
        );
      }
      console.log(`✅ Seeded ${sampleProperties.length} sample properties\n`);
    } else {
      console.log(`⏭️  Sample properties already exist\n`);
    }
    
    // Seed sample projects
    const existingProjects = await client.query('SELECT COUNT(*) FROM projects');
    if (existingProjects.rows[0].count == 0) {
      const sampleProjects = [
        {
          title: '25th Apartments Development Milestone',
          location: 'Igbo-Efon, Lekki, Lagos',
          image: '/images/25th-apartment/25th-apartment-1.jpg',
          description: '9 units of 2-bedroom luxury apartments & 1 unit of 1-bedroom apartment under development in Igbo-Efon, Lekki.',
          status: 'In Progress',
          type: 'Residential',
          total_units: 10,
          completion_percentage: 35,
          budget: 900000000,
          featured: true,
          amenities: ['Gymnasium', 'Swimming pool', '24/7 security', 'Fully serviced environment']
        }
      ];
      
      for (const proj of sampleProjects) {
        await client.query(
          `INSERT INTO projects (title, location, image, description, status, type, total_units, completion_percentage, budget, featured, amenities)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)`,
          [proj.title, proj.location, proj.image, proj.description, proj.status, proj.type, proj.total_units, proj.completion_percentage, proj.budget, proj.featured, JSON.stringify(proj.amenities)]
        );
      }
      console.log(`✅ Seeded ${sampleProjects.length} sample projects\n`);
    } else {
      console.log(`⏭️  Sample projects already exist\n`);
    }
    
    // Seed sample hero slides
    const existingSlides = await client.query('SELECT COUNT(*) FROM hero_slides');
    if (existingSlides.rows[0].count == 0) {
      const sampleSlides = [
        {
          image_url: '/images/25th-apartment/25th-apartment-1.jpg',
          title: "25th Apartments — Igbo-Efon, Lekki",
          tagline: 'Live Where You Belong, Invest Where You Prosper. Luxury 2-Bedroom & 1-Bedroom Apartments with C of O.',
          cta_text: 'Explore Property',
          cta_link: '/properties/25th-apartments',
          sort_order: 1
        },
        {
          image_url: '/images/25th-apartment/25th-apartment-2.jpg',
          title: 'Luxury Living & Prime ROI',
          tagline: '9 Units of Luxury 2-Bedroom & 1-Bedroom Apartments with Gym, Swimming Pool, and 24/7 Security. 3 mins from Lekki-Epe Expressway.',
          cta_text: 'View Property Details',
          cta_link: '/properties/25th-apartments',
          sort_order: 2
        },
        {
          image_url: '/images/25th-apartment/25th-apartment-3.jpg',
          title: 'Now Selling — Flexible Payment Terms',
          tagline: 'Initial Deposit: ₦40,000,000 with 6 Months Payment Plan. Developed by Kayode Segun & Associates.',
          cta_text: 'Book Site Inspection',
          cta_link: '/book-a-tour',
          sort_order: 3
        }
      ];

      for (const slide of sampleSlides) {
        await client.query(
          `INSERT INTO hero_slides (image_url, title, tagline, cta_text, cta_link, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [slide.image_url, slide.title, slide.tagline, slide.cta_text, slide.cta_link, slide.sort_order]
        );
      }
      console.log(`✅ Seeded ${sampleSlides.length} sample hero slides\n`);
    } else {
      console.log(`⏭️  Sample hero slides already exist\n`);
    }

    // Seed default test owner and link properties
    const ownerEmail = 'owner@ksavaluers.com';
    const existingOwner = await client.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [ownerEmail]);
    let ownerId;
    if (existingOwner.rowCount === 0) {
      const ownerHash = await bcrypt.hash('TestPassword123!', 12);
      const ownerRes = await client.query(
        `INSERT INTO users (email, password_hash, role, name, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [ownerEmail, ownerHash, 'propertyowner', 'Owner User', 'active']
      );
      ownerId = ownerRes.rows[0].id;
      console.log(`✅ Seeded test owner user: ${ownerEmail}`);
    } else {
      ownerId = existingOwner.rows[0].id;
      console.log(`⏭️  Owner user already exists: ${ownerEmail}`);
    }

    // Link owner to all sample properties in owner_property
    const allProps = await client.query('SELECT id FROM properties');
    for (const prop of allProps.rows) {
      await client.query(
        `INSERT INTO owner_property (owner_id, property_id)
         VALUES ($1, $2)
         ON CONFLICT (owner_id, property_id) DO NOTHING`,
        [ownerId, prop.id]
      );
    }
    console.log(`✅ Associated owner user to all properties in owner_property\n`);

    console.log('✨ Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
