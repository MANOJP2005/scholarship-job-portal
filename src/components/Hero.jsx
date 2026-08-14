import React from 'react';
import { Search, Sparkles, TrendingUp, ArrowRight, UploadCloud, UserCheck, Lock } from 'lucide-react';

export default function Hero({
  searchKeyword,
  setSearchKeyword,
  onSelectQuickFilter,
  onOpenResumeMatcher,
  user,
  onOpenAuth
}) {
  const quickTags = [
    { label: '10th/12th Pass Jobs', query: '12th Pass' },
    { label: 'RRB NTPC', query: 'RRB' },
    { label: 'SBI PO', query: 'SBI' },
    { label: 'Diploma/Engg Grants', query: 'Diploma' },
    { label: 'ISRO', query: 'ISRO' },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-12">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-stone-50/30 to-transparent dark:from-amber-950/20 dark:via-slate-950 dark:to-transparent pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">

        {/* Personalized Greeting or Gated Access Badge */}
        {user ? (
          <div
            onClick={onOpenAuth}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6 cursor-pointer hover:scale-[1.02] transition-transform shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Welcome, {user.fullName}! • {user.educationLevel || 'Student'}</span>
          </div>
        ) : (
          <div
            onClick={onOpenAuth}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-6 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Create a free account to unlock official apply links & AI matching</span>
          </div>
        )}

        {/* Main Brand Headline with Gradient */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
            VIDYASUDDHI
          </span>
        </h1>

        {/* Tagline */}
        <p className="mt-3 text-base sm:text-lg text-slate-700 dark:text-slate-200 font-semibold tracking-wide">
          Where Academic Sponsorship Meets Elite Recruitment.
        </p>

        {/* Sub-tagline */}
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          For 10th, 12th, Diploma, B.Tech & Degree Students Across India
        </p>

        {/* Search Input Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center rounded-2xl border border-stone-300/90 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-stone-200/50 dark:shadow-slate-900/50 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-400 transition-all">
            <div className="pl-4 text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search RRB NTPC, SBI PO, SSC, 12th Pass jobs, scholarships..."
              className="w-full py-3.5 px-3 text-sm text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-stone-400"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="pr-3 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-semibold"
              >
                Clear
              </button>
            )}
            <div className="pr-2 hidden sm:block">
              <span className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm">
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* AI Resume Matcher Button */}
        <div className="mt-4 flex items-center justify-center">
          {user ? (
            <button
              onClick={onOpenResumeMatcher}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume / Marksheet — AI Match Jobs</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In Free to Unlock Apply Links & AI Matcher</span>
            </button>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-stone-400 dark:text-slate-500 mr-1 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-500" /> Popular:
          </span>
          {quickTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => onSelectQuickFilter(tag.query)}
              className="px-3 py-1 text-xs font-medium bg-stone-100/90 hover:bg-amber-50 dark:bg-slate-800/80 dark:hover:bg-amber-950/30 text-stone-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 rounded-lg border border-stone-200/70 dark:border-slate-700/70 transition-colors"
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
