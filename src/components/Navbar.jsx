import React, { useState } from 'react';
import {
  GraduationCap,
  Bookmark,
  PlusCircle,
  Sun,
  Moon,
  Bell,
  User,
  UserCheck,
  Menu,
  X,
  Sparkles,
  Shield,
  UploadCloud
} from 'lucide-react';

export default function Navbar({
  bookmarkCount = 0,
  activeTab = 'all',
  setActiveTab,
  userRole = 'student',
  setUserRole,
  user,
  onOpenAuth,
  onOpenAdmin,
  onOpenResumeMatcher,
  darkMode,
  setDarkMode,
  onOpenBotSimulator
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/80 dark:border-slate-800 transition-colors backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div
          onClick={() => setActiveTab('all')}
          className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-serif">
                VIDYASUDDHI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-0.5 whitespace-nowrap">
              Academic Sponsorship × Elite Recruitment
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-stone-100/90 dark:bg-slate-900/90 p-1.5 rounded-xl border border-stone-200/70 dark:border-slate-800">
          {[
            { key: 'all', label: 'Explore All' },
            { key: 'jobs', label: 'Govt Jobs' },
            { key: 'scholarships', label: 'Scholarships' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
            {bookmarkCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-amber-600 text-white rounded-full font-bold leading-none">
                {bookmarkCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">

          {/* AI Matcher Button (only for logged-in users) */}
          {user && (
            <button
              onClick={onOpenResumeMatcher}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>AI Matcher</span>
            </button>
          )}

          {/* Bot Simulator / Bell */}
          <button
            onClick={onOpenBotSimulator}
            title="Live Alert Simulator"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth Button */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              user
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm shadow-amber-600/25'
            }`}
          >
            {user ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 animate-fadeIn">

          {/* Nav Links */}
          <div className="space-y-1">
            {[
              { key: 'all', label: 'Explore All' },
              { key: 'jobs', label: 'Govt Jobs (RRB / Banking / SSC)' },
              { key: 'scholarships', label: 'Scholarships' },
              { key: 'bookmarks', label: `Saved Bookmarks (${bookmarkCount})` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setActiveTab(t.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                  activeTab === t.key
                    ? 'bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Additional Mobile Actions */}
          <div className="pt-2 border-t border-stone-100 dark:border-slate-800 space-y-2">
            {user && (
              <button
                onClick={() => {
                  onOpenResumeMatcher();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center space-x-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>AI Resume Matcher</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
