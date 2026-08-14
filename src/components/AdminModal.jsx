import React, { useState, useMemo } from 'react';
import { X, PlusCircle, CheckCircle, ShieldCheck, Lock, Eye, EyeOff, Pencil, Trash2, Search, ArrowLeft, AlertTriangle } from 'lucide-react';
import { categoryOptions, qualificationOptions } from '../data/mockData';

const ADMIN_PASSWORD = 'vidyasuddhi2026';

const emptyForm = {
  title: '', type: 'job', category: 'RRB Railway', organization: '',
  qualification: 'B.E. / B.Tech', vacancies: '', stipendSalary: '',
  applicationFee: 'Free', ageLimit: '18 - 30 Years', deadline: '',
  officialUrl: '', pdfUrl: '', description: '',
};

export default function AdminModal({ isOpen, onClose, opportunities, onAddOpportunity, onEditOpportunity, onDeleteOpportunity }) {
  // Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('vidyasuddhi_admin_session') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Views: 'dashboard' | 'add' | 'edit'
  const [view, setView] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [submitted, setSubmitted] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredOpps = (opportunities || []).filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.organization.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('vidyasuddhi_admin_session', 'true');
      setAdminError('');
    } else {
      setAdminError('Incorrect admin password.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('vidyasuddhi_admin_session');
    setAdminPasswordInput('');
    onClose();
  };

  const openAddForm = () => {
    setFormData({ ...emptyForm });
    setEditingItem(null);
    setView('add');
  };

  const openEditForm = (item) => {
    setFormData({
      title: item.title || '',
      type: item.type || 'job',
      category: item.category || 'RRB Railway',
      organization: item.organization || '',
      qualification: item.qualification || 'B.E. / B.Tech',
      vacancies: item.vacancies || '',
      stipendSalary: item.stipendSalary || '',
      applicationFee: item.applicationFee || 'Free',
      ageLimit: item.ageLimit || '18 - 30 Years',
      deadline: item.deadline || '',
      officialUrl: item.officialUrl || '',
      pdfUrl: item.pdfUrl || '',
      description: item.description || '',
    });
    setEditingItem(item);
    setView('edit');
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (view === 'edit' && editingItem) {
      const updated = {
        ...editingItem,
        ...formData,
        allowedDegrees: [formData.qualification, 'Diploma', 'Graduate', '10th Pass', '12th Pass'],
      };
      onEditOpportunity(updated);
      setSubmitted('Listing Updated Successfully!');
    } else {
      const newOpp = {
        id: `custom-${Date.now()}`,
        ...formData,
        logoText: formData.organization ? formData.organization.substring(0, 3).toUpperCase() : 'GOV',
        logoBg: formData.type === 'job' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white',
        allowedDegrees: [formData.qualification, 'Diploma', 'Graduate', '10th Pass', '12th Pass'],
        vacancies: formData.type === 'job' ? (formData.vacancies || '1,000+ Posts') : 'N/A',
        stipendSalary: formData.stipendSalary || 'As per Govt Norms',
        postedDate: new Date().toISOString().split('T')[0],
        location: 'India',
        pdfUrl: formData.pdfUrl || formData.officialUrl || '#',
        officialUrl: formData.officialUrl || '#',
        eligibilityDetails: ['Educational qualification as per official notification.', 'Age limit as per govt rules.'],
        selectionProcess: ['Written CBT / Screening Test', 'Document Verification'],
        syllabusHighlights: ['General Knowledge', 'Reasoning Ability', 'Domain Skills'],
      };
      onAddOpportunity(newOpp);
      setSubmitted('Listing Published Successfully!');
    }
    setTimeout(() => {
      setSubmitted('');
      setView('dashboard');
      setFormData({ ...emptyForm });
      setEditingItem(null);
    }, 1200);
  };

  const handleDelete = (item) => {
    onDeleteOpportunity(item.id);
    setDeleteConfirm(null);
    setSubmitted('Listing Deleted.');
    setTimeout(() => setSubmitted(''), 1200);
  };
  
  const handleShareWhatsApp = () => {
    const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY format approx
    const top5 = opportunities.slice(0, 5);
    let msg = `🎓 *VIDYASUDDHI Updates - ${today}* 🎓\n\n`;
    top5.forEach((opp, i) => {
      msg += `${i+1}. *${opp.title}*\n`;
      msg += `   Type: ${opp.type === 'job' ? '🏛️ Govt Job' : '🎓 Scholarship'}\n`;
      msg += `   Deadline: ${opp.deadline}\n\n`;
    });
    msg += `👉 Apply now at: https://vidyasuddhi.com`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Form UI (shared for add & edit)
  const renderForm = () => (
    <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
      {/* Type */}
      <div className="grid grid-cols-2 gap-3">
        <label className={`p-3 rounded-xl border cursor-pointer text-center font-bold transition-all ${formData.type === 'job' ? 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-700 dark:text-amber-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'}`}>
          <input type="radio" name="type" value="job" checked={formData.type === 'job'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="sr-only" />
          🏛️ Govt Job
        </label>
        <label className={`p-3 rounded-xl border cursor-pointer text-center font-bold transition-all ${formData.type === 'scholarship' ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'}`}>
          <input type="radio" name="type" value="scholarship" checked={formData.type === 'scholarship'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="sr-only" />
          🎓 Scholarship
        </label>
      </div>

      {/* Title & Org */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
          <input type="text" required placeholder="e.g. RRB Technician 2026" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization *</label>
          <input type="text" required placeholder="e.g. Railway Recruitment Board" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
        </div>
      </div>

      {/* Category & Qualification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
            {categoryOptions.filter(c => c !== "All Categories").map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
          <select value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
            {qualificationOptions.filter(q => q !== "All Qualifications").map((q, i) => <option key={i} value={q}>{q}</option>)}
          </select>
        </div>
      </div>

      {/* Vacancies/Grant & Deadline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">{formData.type === 'job' ? 'Vacancies' : 'Grant Amount'}</label>
          <input type="text" placeholder={formData.type === 'job' ? "e.g. 5,000 Posts" : "e.g. ₹50,000/year"}
            value={formData.type === 'job' ? formData.vacancies : formData.stipendSalary}
            onChange={(e) => { if (formData.type === 'job') setFormData({ ...formData, vacancies: e.target.value }); else setFormData({ ...formData, stipendSalary: e.target.value }); }}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Deadline *</label>
          <input type="date" required value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Apply Link</label>
          <input type="url" placeholder="https://official-portal.gov.in" value={formData.officialUrl} onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">PDF Notice Link</label>
          <input type="url" placeholder="https://example.com/notice.pdf" value={formData.pdfUrl} onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
        <textarea rows="2" placeholder="Brief summary..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center justify-end space-x-2">
        <button type="button" onClick={() => { setView('dashboard'); setEditingItem(null); }}
          className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs">Cancel</button>
        <button type="submit"
          className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md">
          {view === 'edit' ? 'Save Changes' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold">
              {!isAdminAuthenticated ? 'Admin Login' : view === 'dashboard' ? 'Admin Dashboard' : view === 'add' ? 'Add New Listing' : 'Edit Listing'}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {isAdminAuthenticated && (
              <button onClick={handleAdminLogout} className="text-[10px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-semibold">
                Logout
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">

          {/* Password Gate */}
          {!isAdminAuthenticated ? (
            <div className="py-6 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto"><Lock className="w-7 h-7" /></div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Admin Access Required</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Enter the admin password to manage listings.</p>
              </div>
              {adminError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold text-center">{adminError}</div>
              )}
              <form onSubmit={handleAdminLogin} className="space-y-3 max-w-sm mx-auto">
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Enter admin password" value={adminPasswordInput}
                    onChange={(e) => { setAdminPasswordInput(e.target.value); setAdminError(''); }}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md">Unlock Admin Portal</button>
              </form>
            </div>

          ) : submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{submitted}</h4>
            </div>

          ) : view === 'add' || view === 'edit' ? (
            /* Add / Edit Form */
            <div>
              <button onClick={() => { setView('dashboard'); setEditingItem(null); }}
                className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Dashboard</span>
              </button>
              {renderForm()}
            </div>

          ) : (
            /* Dashboard — List all opportunities */
            <div className="space-y-4">

              {/* Top Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input type="text" placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleShareWhatsApp}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm whitespace-nowrap">
                    <span>Share Today's Listings on WhatsApp</span>
                  </button>
                  <button onClick={openAddForm}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm whitespace-nowrap">
                    <PlusCircle className="w-4 h-4" /><span>Add New Listing</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">{filteredOpps.length} listing{filteredOpps.length !== 1 ? 's' : ''} total</p>

              {/* Delete Confirmation */}
              {deleteConfirm && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start space-x-3 animate-fadeIn">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-red-800 dark:text-red-200">Delete "{deleteConfirm.title}"?</p>
                    <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">This action cannot be undone.</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={() => handleDelete(deleteConfirm)} className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold">Yes, Delete</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Listings Table */}
              <div className="space-y-2">
                {filteredOpps.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${item.type === 'job' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'}`}>
                          {item.type === 'job' ? 'JOB' : 'SCHOL'}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{item.organization} • {item.category} • Deadline: {item.deadline}</p>
                    </div>
                    <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => openEditForm(item)} title="Edit"
                        className="p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 text-slate-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(item)} title="Delete"
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
