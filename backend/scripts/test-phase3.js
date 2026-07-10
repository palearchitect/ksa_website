/**
 * Phase 3 Integration & Security Verification Script
 * 
 * Verifies:
 * 1. Login & role mapping/redirect payload for all 4 roles.
 * 2. Role-Based Access Control (RBAC) route guards (expecting 403/redirects).
 * 3. Paystack initiation flow (generating reference).
 * 4. Webhook idempotency (duplicate reference rejection).
 * 
 * Run with: node backend/scripts/test-phase3.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const API_BASE = `http://localhost:${process.env.PORT || 3000}`;

// Test accounts config
const testUsers = [
  { email: 'test-admin@ksavaluers.com', name: 'Test Admin', role: 'admin', pass: 'TestPassword123!' },
  { email: 'test-manager@ksavaluers.com', name: 'Test Manager', role: 'manager', pass: 'TestPassword123!' },
  { email: 'test-owner@ksavaluers.com', name: 'Test Owner', role: 'propertyowner', pass: 'TestPassword123!' },
  { email: 'test-tenant@ksavaluers.com', name: 'Test Tenant', role: 'tenant', pass: 'TestPassword123!' }
];

async function setup() {
  console.log('🧹 Cleaning up test accounts from DB...');
  const emails = testUsers.map(u => u.email);
  await pool.query('DELETE FROM users WHERE email = ANY($1)', [emails]);

  console.log('🌱 Seeding fresh test accounts...');
  for (const u of testUsers) {
    const hash = await bcrypt.hash(u.pass, 12);
    await pool.query(
      'INSERT INTO users (email, password_hash, role, name, status) VALUES ($1, $2, $3, $4, $5)',
      [u.email, hash, u.role, u.name, 'active']
    );
    console.log(`   Seeded ${u.role}: ${u.email}`);
  }
}

async function runTests() {
  await setup();
  console.log('\n🚀 Starting Phase 3 Verification Tests...\n');

  const cookies = {};

  // ── TEST 1: Role Logins & Redirect Payloads ──────────────────────────────
  console.log('🧪 Test 1: Testing Login redirects & role mappings...');
  for (const u of testUsers) {
    try {
      const res = await axios.post(`${API_BASE}/api/v1/auth/login`, {
        email: u.email,
        password: u.pass
      }, {
        validateStatus: false
      });

      if (res.status === 200 && res.data.success) {
        console.log(`   ✅ Login successful for ${u.role} (${u.email})`);
        console.log(`      Payload returned user role: "${res.data.data.role}"`);
        
        // Save cookie headers
        const setCookies = res.headers['set-cookie'];
        if (setCookies) {
          cookies[u.role] = setCookies.map(c => c.split(';')[0]).join('; ');
        }
      } else {
        console.error(`   ❌ Login failed for ${u.role}:`, res.data);
      }
    } catch (err) {
      console.error(`   ❌ HTTP Request error logging in ${u.role}:`, err.message);
    }
  }

  // ── TEST 2: Route Guard / RBAC Controls ──────────────────────────────────
  console.log('\n🧪 Test 2: Testing Route Guards & Scoping...');

  // A. Tenant attempting to call a manager-only endpoint (leases creation/updates)
  try {
    const res = await axios.post(`${API_BASE}/api/pms/leases`, {
      tenantId: 999,
      rentAmount: 100000,
      startDate: '2026-01-01',
      endDate: '2026-12-31'
    }, {
      headers: { Cookie: cookies['tenant'] },
      validateStatus: false
    });

    if (res.status === 403) {
      console.log('   ✅ Route Guard successfully BLOCKED tenant from creating a lease (403 Forbidden)');
    } else {
      console.error(`   ❌ Failed: Tenant was allowed to access manager endpoint (Status: ${res.status})`);
    }
  } catch (err) {
    console.error('   ❌ Error in route guard test A:', err.message);
  }

  // B. Tenant attempting to update ticket statuses (Admin/Manager only)
  try {
    const res = await axios.put(`${API_BASE}/api/pms/tickets/1/status`, {
      status: 'resolved'
    }, {
      headers: { Cookie: cookies['tenant'] },
      validateStatus: false
    });

    if (res.status === 403) {
      console.log('   ✅ Route Guard successfully BLOCKED tenant from updating ticket status (403 Forbidden)');
    } else {
      console.error(`   ❌ Failed: Tenant was allowed to resolve ticket status (Status: ${res.status})`);
    }
  } catch (err) {
    console.error('   ❌ Error in route guard test B:', err.message);
  }

  // C. Owner attempting to fetch all leases (should get blocked or scoped depending on endpoint role permissions)
  try {
    const res = await axios.post(`${API_BASE}/api/pms/leases`, {
      tenantId: 999,
      rentAmount: 100000,
      startDate: '2026-01-01',
      endDate: '2026-12-31'
    }, {
      headers: { Cookie: cookies['propertyowner'] },
      validateStatus: false
    });

    if (res.status === 403) {
      console.log('   ✅ Route Guard successfully BLOCKED property owner from creating a lease (403 Forbidden)');
    } else {
      console.error(`   ❌ Failed: Owner was allowed to access manager post endpoint (Status: ${res.status})`);
    }
  } catch (err) {
    console.error('   ❌ Error in route guard test C:', err.message);
  }

  // ── TEST 3: Paystack Initiation Flow ─────────────────────────────────────
  console.log('\n🧪 Test 3: Testing Tenant Paystack initiation flow...');
  let reference = '';
  try {
    const res = await axios.post(`${API_BASE}/api/pms/payments/initiate`, {
      amount: 150000,
      paymentType: 'rent'
    }, {
      headers: { Cookie: cookies['tenant'] },
      validateStatus: false
    });

    if (res.status === 201 && res.data.success) {
      reference = res.data.data.reference;
      console.log('   ✅ Paystack initiation completed successfully');
      console.log(`      Reference code: "${reference}"`);
      console.log(`      Access Code:    "${res.data.data.accessCode}"`);
      console.log(`      Auth URL:       "${res.data.data.authorizationUrl}"`);
    } else {
      console.error('   ❌ Failed to initiate Paystack payment:', res.data);
    }
  } catch (err) {
    console.error('   ❌ Error initiating payment:', err.message);
  }

  // ── TEST 4: Webhook Idempotency ──────────────────────────────────────────
  console.log('\n🧪 Test 4: Testing Webhook processing & idempotency...');
  if (!reference) {
    console.error('   ❌ Skipping webhook test because reference code was not generated.');
  } else {
    // A. Fire webhook success
    try {
      const res = await axios.post(`${API_BASE}/api/pms/payments/webhook`, {
        event: 'charge.success',
        data: {
          reference: reference,
          amount: 15000000, // 150000 naira in kobo
          status: 'success'
        }
      }, {
        validateStatus: false
      });

      if (res.status === 200 && res.data.success) {
        console.log('   ✅ Webhook processed successfully for the first time');
      } else {
        console.error('   ❌ Webhook failed to process:', res.data);
      }
    } catch (err) {
      console.error('   ❌ Error firing webhook:', err.message);
    }

    // B. Fire duplicate webhook (idempotency guard)
    try {
      const res = await axios.post(`${API_BASE}/api/pms/payments/webhook`, {
        event: 'charge.success',
        data: {
          reference: reference,
          amount: 15000000,
          status: 'success'
        }
      }, {
        validateStatus: false
      });

      if (res.status === 200 && res.data.message === 'Already processed') {
        console.log('   ✅ Webhook Idempotency validated: Duplicate reference was rejected/ignored ("Already processed")');
      } else {
        console.error('   ❌ Webhook Idempotency FAILED: Duplicate was not handled gracefully:', res.data);
      }
    } catch (err) {
      console.error('   ❌ Error firing duplicate webhook:', err.message);
    }
  }

  console.log('\n🏁 Tests Completed. Cleaning up database connection pool.');
  pool.end();
}

runTests().catch(err => {
  console.error('Fatal error running tests:', err);
  pool.end();
});
