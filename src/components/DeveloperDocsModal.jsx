import React, { useState } from 'react';
import { X, Code, Database, Rocket, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

export default function DeveloperDocsModal({ isOpen, onClose }) {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState('sql');

  if (!isOpen) return null;

  const sqlSchema = `-- ========================================================
-- EDUPATH STUDENT PORTAL - PRODUCTION SUPABASE SQL SCHEMA
-- Execute this script in your Supabase SQL Editor
-- ========================================================

-- 1. Create Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('job', 'scholarship')),
  category VARCHAR(100) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  logo_text VARCHAR(10) DEFAULT 'EDU',
  qualification VARCHAR(100) NOT NULL,
  allowed_degrees TEXT[] DEFAULT '{}',
  vacancies VARCHAR(100),
  stipend_salary VARCHAR(100),
  application_fee VARCHAR(255),
  age_limit VARCHAR(100),
  deadline DATE NOT NULL,
  posted_date DATE DEFAULT CURRENT_DATE,
  location VARCHAR(100) DEFAULT 'India',
  official_url TEXT NOT NULL,
  pdf_url TEXT,
  description TEXT,
  eligibility_details TEXT[] DEFAULT '{}',
  selection_process TEXT[] DEFAULT '{}',
  syllabus_highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Access Policy
CREATE POLICY "Allow public read access to opportunities" 
  ON public.opportunities 
  FOR SELECT 
  USING (true);

-- 4. User Bookmarks Table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, opportunity_id)
);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bookmarks" 
  ON public.user_bookmarks 
  FOR ALL 
  USING (auth.uid() = user_id);
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Developer Blueprint & Production Guide</h3>
              <p className="text-xs text-slate-400">Database Schemas, Lovable AI $\rightarrow$ VS Code Workflow & Vercel Deployment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'sql'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase SQL Migration</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'workflow'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Deployment Roadmap</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">PostgreSQL Schema (Supabase Database)</h4>
                  <p className="text-slate-500 dark:text-slate-400">Copy & paste this SQL script directly into your Supabase Dashboard SQL Editor.</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 text-emerald-400 font-mono overflow-x-auto text-[11px] leading-relaxed">
                <pre>{sqlSchema}</pre>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Step-by-Step Production Roadmap
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-2">1</span>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-1">Lovable AI $\rightarrow$ GitHub</h5>
                    <p className="text-slate-500 dark:text-slate-400">Generate initial UI layouts in Lovable, then link your project to your personal GitHub repository.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-2">2</span>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-1">VS Code Development</h5>
                    <p className="text-slate-500 dark:text-slate-400">Clone to VS Code, install <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">npm install</code>, and write your custom database logic and filters.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs mb-2">3</span>
                    <h5 className="font-bold text-slate-900 dark:text-white mb-1">Deploy to Vercel</h5>
                    <p className="text-slate-500 dark:text-slate-400">Connect Vercel to GitHub for zero-downtime automatic deployments whenever you git push.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <h5 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center">
                  <Terminal className="w-4 h-4 mr-1 text-indigo-500" /> CLI Terminal Quick Commands
                </h5>
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
git clone https://github.com/your-username/scholarship-job-portal.git
cd scholarship-job-portal
npm install
npm run dev
                </pre>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
