import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBanner from './components/StatsBanner';
import FilterBar from './components/FilterBar';
import OpportunityCard from './components/OpportunityCard';
import OpportunityModal from './components/OpportunityModal';
import AdminModal from './components/AdminModal';
import AdminPage from './components/AdminPage';
import NewsletterModal from './components/NewsletterModal';
import AuthModal from './components/AuthModal';
import ResumeMatcherModal from './components/ResumeMatcherModal';
import BotSimulatorModal from './components/BotSimulatorModal';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import DeadlineReminder from './components/DeadlineReminder';
import { fetchAdminOpportunities, fetchAdminNotifications, saveAdminOpportunity, removeAdminOpportunity, saveAdminNotification, removeAdminNotification, signInAdmin, signOutAdmin } from './services/adminService';
import { initialOpportunities } from './data/mockData';
import { scholarshipOpportunities } from './data/scholarshipData';
import { jobOpportunities } from './data/jobData';
import { additionalScholarshipOpportunities, educationLoanOpportunities } from './data/additionalScholarshipData';
import { financialAidOpportunities } from './data/financialAidData';
import { Sparkles } from 'lucide-react';

export default function App() {
  const isAdminPage = window.location.pathname === '/admin';
  const defaultOpportunities = [...initialOpportunities, ...scholarshipOpportunities, ...additionalScholarshipOpportunities, ...educationLoanOpportunities, ...financialAidOpportunities, ...jobOpportunities];

  // Opportunities State — persists full list so admin edits/deletes survive refresh
  const [opportunities, setOpportunities] = useState(() => {
    // Clear old key if it exists (one-time migration)
    localStorage.removeItem('vidyasuddhi_custom_opportunities');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filterExpired = (list) => list.filter(item => new Date(item.deadline) >= today);
    const saved = localStorage.getItem('vidyasuddhi_all_opportunities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedIds = new Set(parsed.map(item => item.id));
        const merged = [...parsed, ...scholarshipOpportunities.filter(item => !savedIds.has(item.id)), ...additionalScholarshipOpportunities.filter(item => !savedIds.has(item.id)), ...educationLoanOpportunities.filter(item => !savedIds.has(item.id)), ...financialAidOpportunities.filter(item => !savedIds.has(item.id)), ...jobOpportunities.filter(item => !savedIds.has(item.id))];
        const active = filterExpired(merged);
        // If some expired items were removed, persist the cleaned list
        if (active.length !== parsed.length) {
          localStorage.setItem('vidyasuddhi_all_opportunities', JSON.stringify(active));
        }
        return active;
      } catch (e) {
        return filterExpired(defaultOpportunities);
      }
    }
    return filterExpired(defaultOpportunities);
  });
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('vidyasuddhi_notifications') || '[]'));

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
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'jobs' | 'scholarships'
  const [activeTypeTab, setActiveTypeTab] = useState('all'); // 'all' | 'job' | 'scholarship'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedQualification, setSelectedQualification] = useState('All Qualifications');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  // Modals States
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResumeMatcherOpen, setIsResumeMatcherOpen] = useState(false);
  const [isBotSimulatorOpen, setIsBotSimulatorOpen] = useState(false);
  const [adminDataError, setAdminDataError] = useState('');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('vidyasuddhi_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });

  // Deadline Reminders State
  const [showReminder, setShowReminder] = useState(false);
  const [reminderItems, setReminderItems] = useState([]);

  // Check for upcoming deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const in5Days = new Date();
      in5Days.setDate(now.getDate() + 5);
      
      const upcoming = opportunities.filter(item => {
        const itemDate = new Date(item.deadline);
        return itemDate >= now && itemDate <= in5Days;
      });

      if (upcoming.length > 0) {
        setReminderItems(upcoming);
        setTimeout(() => {
          setShowReminder(true);
        }, 2000);
      }
    };
    
    checkDeadlines();
  }, [opportunities]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [remoteOpportunities, remoteNotifications] = await Promise.all([fetchAdminOpportunities(), fetchAdminNotifications()]);
        if (remoteOpportunities) {
          const remoteById = new Map(remoteOpportunities.map(item => [item.id, item]));
          setOpportunities([...defaultOpportunities.map(item => remoteById.get(item.id) || item), ...remoteOpportunities.filter(item => !defaultOpportunities.some(defaultItem => defaultItem.id === item.id))]);
        }
        if (remoteNotifications) setNotifications(remoteNotifications);
      } catch (error) {
        setAdminDataError('Could not sync with the database. Local data is still available.');
      }
    };
    loadAdminData();
  }, []);

  useEffect(() => {
    localStorage.setItem('vidyasuddhi_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vidyasuddhi_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);



  // Session Timeout Check
  useEffect(() => {
    const checkSession = () => {
      const loginTime = localStorage.getItem('vidyasuddhi_login_time');
      if (loginTime && Date.now() - parseInt(loginTime) > 30 * 60 * 1000) {
        setUser(null);
        localStorage.removeItem('vidyasuddhi_user_profile');
        localStorage.removeItem('vidyasuddhi_login_time');
      }
    };
    
    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Persist full opportunities list whenever it changes
  useEffect(() => {
    localStorage.setItem('vidyasuddhi_all_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  // Add Custom Opportunity via Admin Modal
  const handleAddOpportunity = (newOpportunity) => {
    setOpportunities(prev => [newOpportunity, ...prev]);
    const currentCustom = JSON.parse(localStorage.getItem('vidyasuddhi_custom_opportunities') || '[]');
    localStorage.setItem('vidyasuddhi_custom_opportunities', JSON.stringify([newOpportunity, ...currentCustom]));
    saveAdminOpportunity(newOpportunity).catch(() => setAdminDataError('Listing saved locally, but database sync failed.'));
  };

  // Edit Opportunity via Admin Modal
  const handleEditOpportunity = (updatedItem) => {
    setOpportunities(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    // Also update in custom localStorage if it's a custom listing
    const currentCustom = JSON.parse(localStorage.getItem('vidyasuddhi_custom_opportunities') || '[]');
    const updatedCustom = currentCustom.map(item => item.id === updatedItem.id ? updatedItem : item);
    localStorage.setItem('vidyasuddhi_custom_opportunities', JSON.stringify(updatedCustom));
    saveAdminOpportunity(updatedItem).catch(() => setAdminDataError('Listing updated locally, but database sync failed.'));
  };

  // Delete Opportunity via Admin Modal
  const handleDeleteOpportunity = (itemId) => {
    setOpportunities(prev => prev.filter(item => item.id !== itemId));
    const currentCustom = JSON.parse(localStorage.getItem('vidyasuddhi_custom_opportunities') || '[]');
    localStorage.setItem('vidyasuddhi_custom_opportunities', JSON.stringify(currentCustom.filter(item => item.id !== itemId)));
    removeAdminOpportunity(itemId).catch(() => setAdminDataError('Listing deleted locally, but database sync failed.'));
  };

  const handleAddNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    saveAdminNotification(notification).catch(() => setAdminDataError('Notification saved locally, but database sync failed.'));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(item => item.id !== notificationId));
    removeAdminNotification(notificationId).catch(() => setAdminDataError('Notification deleted locally, but database sync failed.'));
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
    setExperienceFilter('all');
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
      if (activeTypeTab === 'loan' && item.type !== 'loan') return false;
      if (activeTypeTab === 'interest-subsidy' && item.type !== 'interest-subsidy') return false;
      if (activeTypeTab === 'financial-aid' && item.type !== 'financial-aid') return false;
      if (experienceFilter !== 'all' && item.type === 'job' && item.experienceType !== experienceFilter) return false;

      // Category Filter
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) return false;

      // Qualification Filter
      if (selectedQualification !== 'All Qualifications') {
        if (item.qualification === 'All Students (Open)') return true;
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
  }, [opportunities, activeTab, activeTypeTab, selectedCategory, selectedQualification, searchKeyword, urgencyFilter, experienceFilter]);

  // Bookmarked items list
  const bookmarkedItemsList = useMemo(() => {
    return opportunities.filter(item => bookmarks.includes(item.id));
  }, [opportunities, bookmarks]);

  // Stats calculation
  const jobCount = opportunities.filter(i => i.type === 'job').length;
  const scholarshipCount = opportunities.filter(i => i.type === 'scholarship').length;

  if (isAdminPage) {
    return (
      <AdminPage
        opportunities={opportunities}
        onAddOpportunity={handleAddOpportunity}
        onEditOpportunity={handleEditOpportunity}
        onDeleteOpportunity={handleDeleteOpportunity}
        notifications={notifications}
        onAddNotification={handleAddNotification}
        onDeleteNotification={handleDeleteNotification}
        onAdminLogin={signInAdmin}
        onAdminLogout={signOutAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => { window.location.href = '/admin'; }}
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
            experienceFilter={experienceFilter}
            setExperienceFilter={setExperienceFilter}
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

      </main>

      <WhatsAppFloat />

      {/* Footer */}
      <Footer
        onOpenDocs={() => {}}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onOpenAdmin={() => { window.location.href = '/admin'; }}
      />

      {/* Deadline Reminder */}
      {showReminder && (
        <DeadlineReminder
          items={reminderItems}
          onDismiss={() => setShowReminder(false)}
          onSelectItem={(item) => setSelectedItem(item)}
        />
      )}

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
        opportunities={opportunities}
        onAddOpportunity={handleAddOpportunity}
        onEditOpportunity={handleEditOpportunity}
        onDeleteOpportunity={handleDeleteOpportunity}
        notifications={notifications}
        onAddNotification={handleAddNotification}
        onDeleteNotification={handleDeleteNotification}
        onAdminLogin={signInAdmin}
        onAdminLogout={signOutAdmin}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={(u) => { setUser(u); localStorage.setItem('vidyasuddhi_login_time', Date.now().toString()); }}
        onRegister={(u) => { setUser(u); localStorage.setItem('vidyasuddhi_login_time', Date.now().toString()); }}
        onLogout={() => { setUser(null); localStorage.removeItem('vidyasuddhi_login_time'); }}
        bookmarkedItems={bookmarkedItemsList}
        onToggleBookmark={handleToggleBookmark}
        onSelectItem={(item) => { 
          setIsAuthOpen(false); 
          setTimeout(() => setSelectedItem(item), 200); 
        }}
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

      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

    </div>
  );
}
