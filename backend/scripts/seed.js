/**
 * Database Seed Script
 * 
 * Populates the database with initial admin user and sample data.
 * Run with: node backend/scripts/seed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
          title: 'Modern Luxury Villa',
          location: 'Ikoyi, Lagos',
          image: 'https://images.unsplash.com/photo-1570129477492-45c003d96efd?w=600',
          price: 250000000,
          status: 'sale',
          type: 'residential',
          bedrooms: 5,
          bathrooms: 4,
          square_footage: 5000,
          description: 'Stunning modern villa with contemporary architecture',
          featured: true,
          tags: ['luxury', 'villa', 'modern']
        },
        {
          title: 'Commercial Space',
          location: 'VI, Lagos',
          image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600',
          price: 150000000,
          status: 'rent',
          type: 'commercial',
          bedrooms: 0,
          bathrooms: 3,
          square_footage: 3000,
          description: 'Premium commercial office space',
          featured: true,
          tags: ['office', 'commercial']
        }
      ];
      
      for (const prop of sampleProperties) {
        await client.query(
          `INSERT INTO properties (title, location, image, price, status, type, bedrooms, bathrooms, square_footage, description, featured, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb)`,
          [prop.title, prop.location, prop.image, prop.price, prop.status, prop.type, prop.bedrooms, prop.bathrooms, prop.square_footage, prop.description, prop.featured, JSON.stringify(prop.tags)]
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
          title: 'Sunset Gardens',
          location: 'Lekki, Lagos',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
          description: 'Premium residential development with modern amenities',
          status: 'In Progress',
          type: 'Residential',
          total_units: 150,
          completion_percentage: 65,
          budget: 500000000,
          featured: true,
          amenities: ['pool', 'gym', 'security', 'parking']
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
          image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=900&fit=crop',
          title: "Nigeria's Premier Property Valuers",
          tagline: 'Expert property valuations and comprehensive real estate solutions across Nigeria',
          cta_text: 'Explore Properties',
          cta_link: '/properties',
          sort_order: 1
        },
        {
          image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=900&fit=crop',
          title: 'Smart Real Estate Investments',
          tagline: 'Discover high-yield properties in prime locations across Lagos, Abuja, and Port Harcourt',
          cta_text: 'View Ongoing Projects',
          cta_link: '/ongoing-projects',
          sort_order: 2
        },
        {
          image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop',
          title: 'Expert Valuation Reports',
          tagline: 'Get fast, accurate, and bank-recognized valuation reports for your assets',
          cta_text: 'Schedule an Appointment',
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
