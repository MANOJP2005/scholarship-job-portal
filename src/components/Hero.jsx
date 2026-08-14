import React from 'react';
import { Search, Sparkles, TrendingUp, ArrowRight, UploadCloud, UserCheck, Lock } from 'lucide-react';

export default function Hero({
  searchKeyword, setSearchKeyword, onSelectQuickFilter,
  onOpenResumeMatcher, user, onOpenAuth
}) {
  const quickTags = [
    { label: '10th / 12th Pass Jobs', query: '12th Pass' },
    { label: 'RRB NTPC Railway', query: 'RRB' },
    { label: 'SBI PO Banking', query: 'SBI' },
    { label: 'Merit Scholarships', query: 'Scholarship' },
    { label: 'ISRO / DRDO', query: 'ISRO' },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-12">
      {/* Warm gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-stone-50/30 to-transparent dark:from-amber-950/20 dark:via-slate-950 dark:to-transparent pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-400/8 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-emerald-400/6 dark:bg-emerald-500/4 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">

        {user ? (
          <div onClick={onOpenAuth}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6 cursor-pointer hover:scale-[1.02] transition-transform">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Welcome, {user.fullName}! — {user.educationLevel}</span>
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Create a free account to unlock official apply links & AI job matching</span>
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          <span className="block">VIDYASUDDHI</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium italic tracking-wide">
          Where Academic Sponsorship Meets Elite Recruitment.
        </p>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Verified scholarships & government job notifications for 10th, 12th, Diploma, B.Tech & Degree students across India.
        </p>

        {/* Search Bar */}
        <div className="mt-7 max-w-2xl mx-auto">
          <div className="relative flex items-center rounded-2xl border border-stone-300/80 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-stone-200/50 dark:shadow-slate-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-400 transition-all">
            <div className="pl-4 text-stone-400"><Search className="w-5 h-5" /></div>
            <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search RRB, SBI PO, SSC, 12th Pass jobs, scholarships..."
              className="w-full py-3.5 px-3 text-sm text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-stone-400" />
            {searchKeyword && <button onClick={() => setSearchKeyword('')} className="pr-3 text-xs text-stone-400 hover:text-stone-600 font-semibold">Clear</button>}
            <div className="pr-2 hidden sm:block">
              <span className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl inline-flex items-center space-x-1 transition-colors cursor-pointer">
                <span>Search</span><ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* AI Matcher / Sign In CTA */}
        <div className="mt-4 flex items-center justify-center">
          {user ? (
            <button onClick={onOpenResumeMatcher}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02]">
              <UploadCloud className="w-4 h-4" /><span>Upload Resume / Marksheet — AI Match Jobs</span>
            </button>
          ) : (
            <button onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center space-x-2 transition-all hover:scale-[1.02]">
              <Lock className="w-3.5 h-3.5" /><span>Sign In Free to Unlock Apply Links & AI Matcher</span>
            </button>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[11px] font-semibold text-stone-400 dark:text-slate-500 mr-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-500" /> Popular:
          </span>
          {quickTags.map((tag, idx) => (
            <button key={idx} onClick={() => onSelectQuickFilter(tag.query)}
              className="px-2.5 py-1 text-[11px] font-medium bg-stone-100/80 hover:bg-amber-50 dark:bg-slate-800/60 dark:hover:bg-amber-950/30 text-stone-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 rounded-lg border border-stone-200/60 dark:border-slate-700/60 transition-colors">
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
