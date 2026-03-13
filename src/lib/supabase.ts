import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dwwgdkxswvpfipilemsc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3d2dka3hzd3ZwZmlwaWxlbXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTk0NDIsImV4cCI6MjA4NjY3NTQ0Mn0.OJXiFdEGy9U9-hJfdtT0GY_9T3qoadrpdLoltUfRMUU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
