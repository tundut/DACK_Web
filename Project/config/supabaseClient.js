const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vgknrfmxjholecjxccwj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZna25yZm14amhvbGVjanhjY3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NTI1NTAsImV4cCI6MjA2MjMyODU1MH0.EQyAh3a_SoEv87VhPtpLjAqoYbvfUa2pfZUXzhQzBuU';  // Public Anon Key (API key của bạn)

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };