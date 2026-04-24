import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://wfxmenunojwolgfnlqcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeG1lbnVub2p3b2xnZm5scWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjMyNTUsImV4cCI6MjA5MTMzOTI1NX0.YmcAuyziw1kZiWcRTzxSjvOS-N0u14_jJLp2xlz13G0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function pull() {
  console.log("📥 Fetching RESUME_DATA from Supabase...");
  const { data, error } = await supabase
    .from('portfolio_content')
    .select('content')
    .eq('key', 'resume_data')
    .single();
    
  if (error) {
    console.error("❌ Error fetching data:", error);
    return;
  }

  const resumeData = data.content;
  const filePath = path.join(__dirname, 'src', 'data', 'resume.ts');
  
  const fileContent = `import type { ResumeData } from '../types';

export const RESUME_DATA: ResumeData = ${JSON.stringify(resumeData, null, 2)};
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log("✅ Success! src/data/resume.ts has been updated with data from Supabase.");
}

pull();
