
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://piklzelulcyzvaprwuec.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa2x6ZWx1bGN5enZhcHJ3dWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5Mjk5MzEsImV4cCI6MjA1NTUwNTkzMX0.cqDtsrqRjYgILthwtzf3FDuryTarzoSt3uThaxwZ0D8';

export const supabase = createClient(supabaseUrl, supabaseKey);
