import React, { useState } from 'react';
import { GraduationCap, Bookmark, PlusCircle, Code, Sun, Moon, Bell, User, Shield, Menu, X, UploadCloud, LogIn } from 'lucide-react';

export default function Navbar({
  bookmarkCount, activeTab, setActiveTab, userRole, setUserRole, user,
  onOpenAuth, onOpenAdmin, onOpenDocs, onOpenResumeMatcher,
  darkMode, setDarkMode, onOpenBotSimulator
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <div onClick={() => setActiveTab('all')} className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">VIDYASUDDHI</span>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-wide -mt-0.5">Academic Sponsorship & Elite Recruitment</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-1 bg-stone-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-stone-200/60 dark:border-slate-800">
          {[
            { key: 'all', label: 'Explore All' },
            { key: 'jobs', label: 'Govt Jobs' },
            { key: 'scholarships', label: 'Scholarships' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}>{tab.label}</button>
          ))}
          <button onClick={() => setActiveTab('bookmarks')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}>
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
            {bookmarkCount > 0 && <span className="ml-1 px-1.5 text-[10px] bg-amber-600 text-white rounded-full font-bold">{bookmarkCount}</span>}
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">

          {/* Role Switcher */}
          <div className="hidden xl:flex items-center bg-stone-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
            <button onClick={() => setUserRole('student')}
              className={`px-2 py-1 rounded-md transition-all ${
                userRole === 'student' ? 'bg-white dark:bg-slate-700 text-amber-700 shadow-sm' : 'text-slate-500'
              }`}>Student</button>
            <button onClick={() => setUserRole('admin')}
              className={`px-2 py-1 rounded-md transition-all ${
                userRole === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-500'
              }`}>Recruiter</button>
          </div>

          {user && (
            <button onClick={onOpenResumeMatcher}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors">
              <UploadCloud className="w-3.5 h-3.5" /><span>AI Match</span>
            </button>
          )}

          <button onClick={onOpenBotSimulator}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </button>

          {userRole === 'admin' && user && (
            <button onClick={onOpenAdmin}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 text-[11px] font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-all">
              <PlusCircle className="w-3.5 h-3.5" /><span>Post</span>
            </button>
          )}

          <button onClick={onOpenAuth}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-colors ${
              user
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm shadow-amber-600/20'
            }`}>
            {user ? <User className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            <span>{user ? user.fullName.split(' ')[0] : 'Sign In Free'}</span>
          </button>

          <button onClick={onOpenDocs}
            className="hidden xl:flex p-2 text-slate-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg">
            <Code className="w-4 h-4" />
          </button>

          <button onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 animate-fadeIn">
          <div className="flex bg-stone-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold mb-3">
            <button onClick={() => setUserRole('student')}
              className={`flex-1 py-1.5 rounded-lg ${userRole === 'student' ? 'bg-amber-600 text-white' : 'text-slate-500'}`}>
              🎓 Student
            </button>
            <button onClick={() => setUserRole('admin')}
              className={`flex-1 py-1.5 rounded-lg ${userRole === 'admin' ? 'bg-amber-600 text-white' : 'text-slate-500'}`}>
              💼 Recruiter
            </button>
          </div>
          {[{key:'all',label:'Explore All'},{key:'jobs',label:'Govt Jobs (RRB/Banking/SSC)'},{key:'scholarships',label:'Scholarships'},{key:'bookmarks',label:'Saved Bookmarks'}].map(t=>(
            <button key={t.key} onClick={()=>{setActiveTab(t.key);setMobileMenuOpen(false);}}
              className="w-full text-left py-2.5 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800 rounded-lg">
              {t.label}
            </button>
          ))}
          {user && (
            <button onClick={()=>{onOpenResumeMatcher();setMobileMenuOpen(false);}}
              className="w-full text-left py-2.5 px-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg flex items-center space-x-1">
              <UploadCloud className="w-4 h-4 mr-1"/><span>AI Resume Matcher</span>
            </button>
          )}
          {userRole === 'admin' && user && (
            <button onClick={()=>{onOpenAdmin();setMobileMenuOpen(false);}}
              className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs mt-1">
              + Post Opportunity
            </button>
          )}
        </div>
      )}
    </header>
  );
}
