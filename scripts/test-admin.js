const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
console.log("hello");
// Read .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');

const env = {};
envConfig.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Admin Connection...');
console.log('URL:', url);
console.log('Key (last 4):', key ? '...' + key.slice(-4) : 'MISSING');

if (!url || !key) {
  console.error('Missing URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function test() {
  try {
    console.log('Attempting to list users...');
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('FAILED:', error.message);
    } else {
      console.log('SUCCESS: Retrieved users list.');
      console.log('Count:', data.users.length);
    }
  } catch (err) {
    console.error('CRASH:', err);
  }
}

test();
