// Test script to verify Supabase keys and database connection
// Run with: node test-supabase-keys.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

async function testKeys() {
  console.log('\n🔍 Testing Supabase Keys...\n');

  // 1. Check environment variables exist
  console.log('1️⃣ Checking environment variables...');
  const vars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing',
    'DATABASE_URL': process.env.DATABASE_URL ? '✓ Set' : '✗ Missing',
  };
  console.table(vars);

  // 2. Test Supabase URL is reachable
  console.log('\n2️⃣ Testing Supabase URL...');
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(`   Status: ${response.status} ${response.status === 200 ? '✓' : '✗'}`);
  } catch (err) {
    console.log(`   ✗ Error: ${err.message}`);
  }

  // 3. Test Anon Key (public client)
  console.log('\n3️⃣ Testing Anon Key (public client)...');
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    // Try a simple query that should work
    const { error } = await supabase.from('shared_reports').select('count').limit(1);
    if (error && error.code === '42P01') {
      console.log('   ⚠ Table "shared_reports" does not exist - need to run SQL migration');
    } else if (error && error.message.includes('schema cache')) {
      console.log('   ⚠ Schema cache issue - table exists but not in cache');
    } else if (error) {
      console.log(`   ⚠ Query error: ${error.message}`);
    } else {
      console.log('   ✓ Anon key works!');
    }
  } catch (err) {
    console.log(`   ✗ Error: ${err.message}`);
  }

  // 4. Test Service Role Key (admin client)
  console.log('\n4️⃣ Testing Service Role Key (admin client)...');
  try {
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { error } = await adminSupabase.from('shared_reports').select('count').limit(1);
    if (error && error.code === '42P01') {
      console.log('   ⚠ Table "shared_reports" does not exist - need to run SQL migration');
    } else if (error && error.message.includes('schema cache')) {
      console.log('   ⚠ Schema cache issue - table exists but not in cache');
    } else if (error) {
      console.log(`   ⚠ Query error: ${error.message}`);
    } else {
      console.log('   ✓ Service role key works!');
    }
  } catch (err) {
    console.log(`   ✗ Error: ${err.message}`);
  }

  // 5. Test Direct PostgreSQL Connection (DATABASE_URL)
  console.log('\n5️⃣ Testing Direct PostgreSQL Connection (DATABASE_URL)...');
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    // Test basic connection
    const result = await client.query('SELECT NOW() as time');
    console.log(`   ✓ Connected! Server time: ${result.rows[0].time}`);

    // Check if shared_reports table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'shared_reports'
      ) as exists
    `);

    if (tableCheck.rows[0].exists) {
      console.log('   ✓ Table "shared_reports" exists!');

      // Count rows
      const countResult = await client.query('SELECT COUNT(*) FROM shared_reports');
      console.log(`   ℹ Table has ${countResult.rows[0].count} rows`);
    } else {
      console.log('   ✗ Table "shared_reports" does NOT exist!');
      console.log('   → Run the SQL migration in Supabase Dashboard');
    }

    client.release();
    await pool.end();
  } catch (err) {
    console.log(`   ✗ Error: ${err.message}`);
    if (err.message.includes('password authentication failed')) {
      console.log('   → Check your DATABASE_URL password');
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
      console.log('   → Check your DATABASE_URL host');
    }
  }

  console.log('\n✅ Key verification complete!\n');
}

testKeys().catch(console.error);
