const { createClient } = require('@supabase/supabase-js');

// Read Supabase credentials from environment variables
// Add SUPABASE_URL and SUPABASE_ANON_KEY to your backend/.env file
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize the Supabase Client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Example function to test connection
 * Replace 'properties' with any table name from your Supabase project
 */
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('properties') // Replace with your table name (e.g. 'properties', 'users', etc.)
      .select('*')
      .limit(3);

    if (error) {
      throw error;
    }
    console.log('✅ Supabase Client Connection Successful!');
    console.log('Data sample:', data);
    return data;
  } catch (error) {
    console.error('❌ Supabase Client Connection Error:', error.message);
    return null;
  }
};

module.exports = {
  supabase,
  testSupabaseConnection
};
