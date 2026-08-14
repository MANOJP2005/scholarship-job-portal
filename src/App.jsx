import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBanner from './components/StatsBanner';
import FilterBar from './components/FilterBar';
import OpportunityCard from './components/OpportunityCard';
import OpportunityModal from './components/OpportunityModal';
import AdminModal from './components/AdminModal';
import DeveloperDocsModal from './components/DeveloperDocsModal';
import NewsletterModal from './components/NewsletterModal';
import AuthModal from './components/AuthModal';
import ResumeMatcherModal from './components/ResumeMatcherModal';
import BotSimulatorModal from './components/BotSimulatorModal';
import BookmarksView from './components/BookmarksView';
import Footer from './components/Footer';
import { initialOpportunities } from './data/mockData';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Opportunities State (Initial Mock + LocalStorage Custom Admin Posts)
  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('vidyasuddhi_custom_opportunities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...initialOpportunities];
      } catch (e) {
        return initialOpportunities;
      }
    }
    return initialOpportunities;
  });

  // User Profile & Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vidyasuddhi_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // User Role (admin access is now password-protected via AdminModal)
  const [userRole, setUserRole] = useState('student');

  // Ref for scrolling to results on search
  const resultsRef = useRef(null);

  // Telegram & WhatsApp Official Links State
  const [telegramLink, setTelegramLink] = useState(() => {
    return localStorage.getItem('vidyasuddhi_tg_link') || 'https://t.me/student_opportunities';
  });
  const [whatsappLink, setWhatsappLink] = useState(() => {
    return localStorage.getItem('vidyasuddhi_wa_link') || 'https://whatsapp.com/channel/student_job_alerts';
  });

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('vidyasuddhi_bookmarks');
    return saved ? JSON.parse(saved) : ['rrb-ntpc-2026', 'jindal-scholarship-2026'];
  });

  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'jobs' | 'scholarships' | 'bookmarks'
  const [activeTypeTab, setActiveTypeTab] = useState('all'); // 'all' | 'job' | 'scholarship'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedQualification, setSelectedQualification] = useState('All Qualifications');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  // Modals States
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResumeMatcherOpen, setIsResumeMatcherOpen] = useState(false);
  const [isBotSimulatorOpen, setIsBotSimulatorOpen] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('vidyasuddhi_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vidyasuddhi_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);



  // Persist User Profile
  useEffect(() => {
    if (user) {
      localStorage.setItem('vidyasuddhi_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('vidyasuddhi_user_profile');
    }
  }, [user]);

  // Persist Bookmarks
  useEffect(() => {
    localStorage.setItem('vidyasuddhi_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Handle Channel Link Updates
  const handleUpdateChannelLinks = (tg, wa) => {
    setTelegramLink(tg);
    setWhatsappLink(wa);
    localStorage.setItem('vidyasuddhi_tg_link', tg);
    localStorage.setItem('vidyasuddhi_wa_link', wa);
  };

  // Toggle Bookmark Handler
  const handleToggleBookmark = (id) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add Custom Opportunity via Admin Modal
  const handleAddOpportunity = (newOpportunity) => {
    setOpportunities(prev => [newOpportunity, ...prev]);
    const currentCustom = JSON.parse(localStorage.getItem('vidyasuddhi_custom_opportunities') || '[]');
    localStorage.setItem('vidyasuddhi_custom_opportunities', JSON.stringify([newOpportunity, ...currentCustom]));
  };

  // Quick Tag Select Handler + auto-scroll to results
  const handleSelectQuickFilter = (query) => {
    setSearchKeyword(query);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('All Categories');
    setSelectedQualification('All Qualifications');
    setUrgencyFilter('all');
    setActiveTypeTab('all');
  };

  // Filtered Opportunities Engine
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(item => {
      // Type Filter
      if (activeTab === 'jobs' && item.type !== 'job') return false;
      if (activeTab === 'scholarships' && item.type !== 'scholarship') return false;
      if (activeTypeTab === 'job' && item.type !== 'job') return false;
      if (activeTypeTab === 'scholarship' && item.type !== 'scholarship') return false;

      // Category Filter
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) return false;

      // Qualification Filter
      if (selectedQualification !== 'All Qualifications') {
        const matchesQual = item.qualification.toLowerCase().includes(selectedQualification.toLowerCase()) ||
          (item.allowedDegrees && item.allowedDegrees.some(d => d.toLowerCase().includes(selectedQualification.toLowerCase())));
        if (!matchesQual) return false;
      }

      // Search Query
      if (searchKeyword.trim() !== '') {
        const query = searchKeyword.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesOrg = item.organization.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesQual = item.qualification.toLowerCase().includes(query);
        if (!matchesTitle && !matchesOrg && !matchesCat && !matchesQual) return false;
      }

      // Deadline Urgency
      if (urgencyFilter === 'closing_soon') {
        const today = new Date();
        const target = new Date(item.deadline);
        const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        if (diffDays > 30 || diffDays < 0) return false;
      }

      return true;
    });
  }, [opportunities, activeTab, activeTypeTab, selectedCategory, selectedQualification, searchKeyword, urgencyFilter]);

  // Bookmarked items list
  const bookmarkedItemsList = useMemo(() => {
    return opportunities.filter(item => bookmarks.includes(item.id));
  }, [opportunities, bookmarks]);

  // Stats calculation
  const jobCount = opportunities.filter(i => i.type === 'job').length;
  const scholarshipCount = opportunities.filter(i => i.type === 'scholarship').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        bookmarkCount={bookmarks.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenResumeMatcher={() => {
          if (!user) {
            setIsAuthOpen(true);
          } else {
            setIsResumeMatcherOpen(true);
          }
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenBotSimulator={() => setIsBotSimulatorOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {activeTab === 'bookmarks' ? (
          <BookmarksView
            bookmarkedItems={bookmarkedItemsList}
            onToggleBookmark={handleToggleBookmark}
            onSelect={(item) => setSelectedItem(item)}
            onBackToFeed={() => setActiveTab('all')}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              onSelectQuickFilter={handleSelectQuickFilter}
              onOpenResumeMatcher={() => {
                if (!user) {
                  setIsAuthOpen(true);
                } else {
                  setIsResumeMatcherOpen(true);
                }
              }}
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
            />

            {/* Metrics Banner */}
            <StatsBanner
              totalCount={opportunities.length}
              jobCount={jobCount}
              scholarshipCount={scholarshipCount}
            />

            {/* Smart Filters Bar */}
            <FilterBar
              activeTypeTab={activeTypeTab}
              setActiveTypeTab={setActiveTypeTab}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedQualification={selectedQualification}
              setSelectedQualification={setSelectedQualification}
              urgencyFilter={urgencyFilter}
              setUrgencyFilter={setUrgencyFilter}
              onResetFilters={handleResetFilters}
              resultCount={filteredOpportunities.length}
            />

            {/* Opportunities Cards Grid */}
            <div id="results-grid" ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              
              {filteredOpportunities.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Opportunities Match Your Current Search</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Try clearing your search keyword or switching your qualification filter to "All Qualifications".
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                  >
                    Reset All Search Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((item) => (
                    <OpportunityCard
                      key={item.id}
                      item={item}
                      isBookmarked={bookmarks.includes(item.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onSelect={(opp) => setSelectedItem(opp)}
                      user={user}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Slide-overs */}
      <OpportunityModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isBookmarked={selectedItem ? bookmarks.includes(selectedItem.id) : false}
        onToggleBookmark={handleToggleBookmark}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAddOpportunity={handleAddOpportunity}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={(u) => setUser(u)}
        onRegister={(u) => setUser(u)}
        onLogout={() => setUser(null)}
      />

      <ResumeMatcherModal
        isOpen={isResumeMatcherOpen}
        onClose={() => setIsResumeMatcherOpen(false)}
        user={user}
        opportunities={opportunities}
        onSelectOpportunity={(opp) => setSelectedItem(opp)}
      />

      <BotSimulatorModal
        isOpen={isBotSimulatorOpen}
        onClose={() => setIsBotSimulatorOpen(false)}
        telegramLink={telegramLink}
        whatsappLink={whatsappLink}
        onUpdateLinks={handleUpdateChannelLinks}
      />

      <DeveloperDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

    </div>
  );
}
