import React, { useState, useMemo } from 'react';
import { X, PlusCircle, CheckCircle, ShieldCheck, Lock, Eye, EyeOff, Pencil, Trash2, Search, ArrowLeft, AlertTriangle, LayoutDashboard, BriefcaseBusiness, GraduationCap, Bell, Send } from 'lucide-react';
import { categoryOptions } from '../data/mockData';

const qualificationChoices = ['10th / 12th Pass', 'Diploma', 'B.E. / B.Tech', 'Graduate (Any)', 'Post Graduate'];
const emptyForm = {
  title: '', type: 'job', category: 'RRB Railway', organization: '',
  qualifications: [], vacancies: '', stipendSalary: '',
  applicationFee: 'Free', ageLimit: '18 - 30 Years', deadline: '',
  officialUrl: '', pdfUrl: '', description: '', eligibilityDetails: '', selectionProcess: '', syllabusHighlights: '',
  scholarshipProvider: '', scholarshipAmount: '', incomeLimit: '', requiredDocuments: '', benefits: '', applicationSteps: '',
  status: 'LIVE', lastVerified: new Date().toISOString().split('T')[0], eligibilityAudience: 'All India',
  experienceType: 'Freshers',
};

export default function AdminModal({ isOpen, onClose, opportunities, onAddOpportunity, onEditOpportunity, onDeleteOpportunity, notifications = [], onAddNotification, onDeleteNotification, onAdminLogin, onAdminLogout, pageMode = false }) {
  // Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('vidyasuddhi_admin_session') === 'true';
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Views: 'dashboard' | 'add' | 'edit'
  const [view, setView] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [submitted, setSubmitted] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '', audience: 'All Students' });
  const [customQualInput, setCustomQualInput] = useState('');

  if (!isOpen) return null;

  const filteredOpps = (opportunities || []).filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.organization.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });
  const sectionOpps = activeSection === 'jobs' ? filteredOpps.filter(item => item.type === 'job') : activeSection === 'scholarships' ? filteredOpps.filter(item => item.type === 'scholarship') : filteredOpps;

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (onAdminLogin) {
      const result = await onAdminLogin(adminEmailInput, adminPasswordInput);
      if (result?.error) {
        setAdminError(result.error.message || 'Unable to sign in.');
        return;
      }
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('vidyasuddhi_admin_session', 'true');
      setAdminError('');
      return;
    }
    setAdminError('Administrator authentication is not configured.');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('vidyasuddhi_admin_session');
    setAdminPasswordInput('');
    onAdminLogout?.();
    onClose();
  };

  const openAddForm = () => {
    setFormData({ ...emptyForm });
    setCustomQualInput('');
    setEditingItem(null);
    setView('add');
  };

  const openEditForm = (item) => {
    // Restore qualifications array from existing item
    const existingQuals = item.allowedDegrees
      ? qualificationChoices.filter(q => item.allowedDegrees.some(d => d.toLowerCase().includes(q.toLowerCase())))
      : qualificationChoices.filter(q => q === item.qualification);
    // Detect any custom (non-standard) qualifications
    const customQuals = item.allowedDegrees
      ? item.allowedDegrees.filter(d => !qualificationChoices.some(q => q.toLowerCase() === d.toLowerCase()))
      : [];
    setCustomQualInput(customQuals.join(', '));
    setFormData({
      title: item.title || '',
      type: item.type || 'job',
      category: item.category || 'RRB Railway',
      organization: item.organization || '',
      qualifications: [...existingQuals, ...customQuals],
      vacancies: item.vacancies || '',
      stipendSalary: item.stipendSalary || '',
      applicationFee: item.applicationFee || 'Free',
      ageLimit: item.ageLimit || '18 - 30 Years',
      deadline: item.deadline || '',
      officialUrl: item.officialUrl || '',
      pdfUrl: item.pdfUrl || '',
      description: item.description || '',
      eligibilityDetails: (item.eligibilityDetails || []).join('\n'),
      selectionProcess: (item.selectionProcess || []).join('\n'),
      syllabusHighlights: (item.syllabusHighlights || []).join('\n'),
      scholarshipProvider: item.scholarshipProvider || '', scholarshipAmount: item.scholarshipAmount || '',
      incomeLimit: item.incomeLimit || '', requiredDocuments: (item.requiredDocuments || []).join('\n'),
      benefits: (item.benefits || []).join('\n'), applicationSteps: (item.applicationSteps || []).join('\n'),
      status: item.status || 'LIVE', lastVerified: item.lastVerified || new Date().toISOString().split('T')[0], eligibilityAudience: item.eligibilityAudience || 'All India',
      experienceType: item.experienceType || 'Freshers',
    });
    setEditingItem(item);
    setView('edit');
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Merge custom qualification if provided
    const customTrimmed = customQualInput.trim();
    const allSelected = customTrimmed
      ? [...formData.qualifications.filter(q => !customQualInput.split(',').map(s => s.trim()).includes(q)), ...customTrimmed.split(',').map(s => s.trim()).filter(Boolean)]
      : formData.qualifications;
    const finalQuals = [...new Set(allSelected)];
    if (finalQuals.length === 0) return;
    const isAll = qualificationChoices.every(q => finalQuals.includes(q)) && !customTrimmed;
    const resolvedDegrees = finalQuals;
    const qualificationLabel = isAll ? 'All Students (Open)' : finalQuals.join(', ');

    if (view === 'edit' && editingItem) {
      const updated = {
        ...editingItem,
        ...formData,
        qualification: qualificationLabel,
        allowedDegrees: resolvedDegrees,
        eligibilityDetails: formData.eligibilityDetails.split('\n').map(value => value.trim()).filter(Boolean),
        selectionProcess: formData.type === 'job' ? formData.selectionProcess.split('\n').map(value => value.trim()).filter(Boolean) : [],
        syllabusHighlights: formData.type === 'job' ? formData.syllabusHighlights.split('\n').map(value => value.trim()).filter(Boolean) : [],
        scholarshipProvider: formData.type === 'scholarship' ? formData.scholarshipProvider : '', scholarshipAmount: formData.type === 'scholarship' ? formData.scholarshipAmount : '',
        incomeLimit: formData.type === 'scholarship' ? formData.incomeLimit : '', requiredDocuments: formData.type === 'scholarship' ? formData.requiredDocuments.split('\n').map(value => value.trim()).filter(Boolean) : [],
        benefits: formData.type === 'scholarship' ? formData.benefits.split('\n').map(value => value.trim()).filter(Boolean) : [], applicationSteps: formData.type === 'scholarship' ? formData.applicationSteps.split('\n').map(value => value.trim()).filter(Boolean) : [],
        status: formData.type === 'job' ? formData.status : undefined, lastVerified: formData.type === 'job' ? formData.lastVerified : undefined, eligibilityAudience: formData.type === 'job' ? formData.eligibilityAudience : undefined, experienceType: formData.type === 'job' ? formData.experienceType : undefined,
      };
      onEditOpportunity(updated);
      setSubmitted('Listing Updated Successfully!');
    } else {
      const newOpp = {
        id: `custom-${Date.now()}`,
        ...formData,
        qualification: qualificationLabel,
        logoText: formData.organization ? formData.organization.substring(0, 3).toUpperCase() : 'GOV',
        logoBg: formData.type === 'job' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white',
        allowedDegrees: resolvedDegrees,
        vacancies: formData.type === 'job' ? (formData.vacancies || '1,000+ Posts') : 'N/A',
        stipendSalary: formData.stipendSalary || 'As per Govt Norms',
        postedDate: new Date().toISOString().split('T')[0],
        location: 'India',
        pdfUrl: formData.pdfUrl || formData.officialUrl || '#',
        officialUrl: formData.officialUrl || '#',
        eligibilityDetails: formData.eligibilityDetails.split('\n').map(value => value.trim()).filter(Boolean),
        selectionProcess: formData.type === 'job' ? formData.selectionProcess.split('\n').map(value => value.trim()).filter(Boolean) : [],
        syllabusHighlights: formData.type === 'job' ? formData.syllabusHighlights.split('\n').map(value => value.trim()).filter(Boolean) : [],
        scholarshipProvider: formData.scholarshipProvider, scholarshipAmount: formData.scholarshipAmount, incomeLimit: formData.incomeLimit,
        requiredDocuments: formData.requiredDocuments.split('\n').map(value => value.trim()).filter(Boolean), benefits: formData.benefits.split('\n').map(value => value.trim()).filter(Boolean), applicationSteps: formData.applicationSteps.split('\n').map(value => value.trim()).filter(Boolean),
        status: formData.status, lastVerified: formData.lastVerified, eligibilityAudience: formData.eligibilityAudience,
      };
      onAddOpportunity(newOpp);
      setSubmitted('Listing Published Successfully!');
    }
    setTimeout(() => {
      setSubmitted('');
      setView('dashboard');
      setFormData({ ...emptyForm });
      setCustomQualInput('');
      setEditingItem(null);
    }, 1200);
  };

  const handleDelete = (item) => {
    onDeleteOpportunity(item.id);
    setDeleteConfirm(null);
    setSubmitted('Listing Deleted.');
    setTimeout(() => setSubmitted(''), 1200);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    onAddNotification?.({ id: `notification-${Date.now()}`, ...notificationForm, createdAt: new Date().toISOString() });
    setNotificationForm({ title: '', message: '', audience: 'All Students' });
    setSubmitted('Notification Published Successfully!');
    setTimeout(() => setSubmitted(''), 1200);
  };
  
  const handleShareWhatsApp = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const today = new Date().toLocaleDateString('en-GB');
    const updatedToday = opportunities.filter(item => (item.lastVerified || item.postedDate) === currentDate);
    let msg = `🎓 *VIDYASUDDHI Daily Updates - ${today}* 🎓\n\n`;
    msg += `*${updatedToday.length} opportunities updated today*\n\n`;
    updatedToday.forEach((opp, i) => {
      msg += `${i+1}. *${opp.title}*\n`;
      msg += `   Type: ${opp.type === 'job' ? '🏛️ Govt Job' : opp.type === 'loan' ? '💰 Education Loan' : opp.type === 'interest-subsidy' ? '💸 Interest Subsidy' : opp.type === 'financial-aid' ? '🏦 Financial Aid' : '🎓 Scholarship'}\n`;
      if (opp.status) msg += `   Status: ${opp.status}\n`;
      msg += `   Deadline: ${opp.deadline}\n\n`;
      if (opp.type === 'job') msg += `   Eligibility: ${opp.eligibilityAudience || 'As per official notification'}\n`;
      msg += `   Benefit: ${opp.type === 'job' ? (opp.stipendSalary || 'As per notification') : (opp.scholarshipAmount || opp.stipendSalary || 'See official details')}\n`;
      msg += `   Official link: ${opp.officialUrl}\n\n`;
    });
    if (updatedToday.length === 0) msg += 'No opportunities were updated today. Please check again after the next verified update.\n\n';
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
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Qualification * <span className="text-slate-400 font-normal">(select all that apply)</span>
          </label>
          <div className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-1.5">
            {qualificationChoices.map((q, i) => (
              <label key={i} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.qualifications.includes(q)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...formData.qualifications, q]
                      : formData.qualifications.filter(x => x !== q);
                    setFormData({ ...formData, qualifications: updated });
                  }}
                  className="w-3.5 h-3.5 accent-amber-600"
                />
                <span className="text-slate-800 dark:text-slate-200">{q}</span>
              </label>
            ))}
            {/* Other / Custom */}
            <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!customQualInput.trim()}
                  onChange={(e) => { if (!e.target.checked) setCustomQualInput(''); }}
                  className="w-3.5 h-3.5 accent-amber-600"
                />
                <span className="text-slate-800 dark:text-slate-200">Other (specify)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MBA, CA, LLB (comma separated)"
                value={customQualInput}
                onChange={(e) => setCustomQualInput(e.target.value)}
                className="mt-1.5 w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>
          {formData.qualifications.length === 0 && !customQualInput.trim() && (
            <p className="text-red-500 text-[10px] mt-1">Select at least one qualification.</p>
          )}
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

      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">{formData.type === 'job' ? 'Job details' : 'Scholarship details'}</h4>
        {formData.type === 'scholarship' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Scholarship provider / foundation" value={formData.scholarshipProvider} onChange={(e) => setFormData({ ...formData, scholarshipProvider: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
              <input placeholder="Award amount / frequency" value={formData.scholarshipAmount} onChange={(e) => setFormData({ ...formData, scholarshipAmount: e.target.value, stipendSalary: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
              <input placeholder="Family income limit" value={formData.incomeLimit} onChange={(e) => setFormData({ ...formData, incomeLimit: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
            </div>
            <textarea rows="3" placeholder="Required documents, one per line" value={formData.requiredDocuments} onChange={(e) => setFormData({ ...formData, requiredDocuments: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
            <textarea rows="3" placeholder="Scholarship benefits, one per line" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
            <textarea rows="3" placeholder="Application steps, one per line" value={formData.applicationSteps} onChange={(e) => setFormData({ ...formData, applicationSteps: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"><option>LIVE</option><option>EXAM STAGE</option><option>RESTRICTED</option><option>CLOSED</option></select>
              <input type="date" value={formData.lastVerified} onChange={(e) => setFormData({ ...formData, lastVerified: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
              <input placeholder="Eligibility audience" value={formData.eligibilityAudience} onChange={(e) => setFormData({ ...formData, eligibilityAudience: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
              <select value={formData.experienceType} onChange={(e) => setFormData({ ...formData, experienceType: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"><option>Freshers</option><option>Experienced</option><option>Apprenticeship</option><option>Contract</option></select>
            </div>
            <textarea rows="3" placeholder="Eligibility criteria, one per line" value={formData.eligibilityDetails} onChange={(e) => setFormData({ ...formData, eligibilityDetails: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
            <textarea rows="3" placeholder="Selection process, one per line" value={formData.selectionProcess} onChange={(e) => setFormData({ ...formData, selectionProcess: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
            <textarea rows="3" placeholder="Syllabus highlights, one per line" value={formData.syllabusHighlights} onChange={(e) => setFormData({ ...formData, syllabusHighlights: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
          </>
        )}
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
    <div className={`${pageMode ? 'min-h-screen bg-stone-50 dark:bg-slate-800' : 'fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6'} animate-fadeIn`}>
      <div className={`relative w-full ${pageMode ? 'max-w-7xl min-h-screen' : 'max-w-3xl max-h-[90vh] rounded-3xl'} mx-auto bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col`}>

        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-bold">
              {pageMode ? 'VIDYASUDDHI ADMIN CONSOLE' : !isAdminAuthenticated ? 'Admin Login' : view === 'dashboard' ? 'Admin Dashboard' : view === 'add' ? 'Add New Listing' : 'Edit Listing'}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {isAdminAuthenticated && (
              <button onClick={handleAdminLogout} className="text-[10px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-semibold">
                Logout
              </button>
            )}
            <button onClick={onClose} title={pageMode ? 'Back to portal' : 'Close'} className="p-1 rounded-full hover:bg-white/20 text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Body */}
        <div className={`${pageMode ? 'p-4 sm:p-8 lg:p-10' : 'p-5 sm:p-6'} overflow-y-auto flex-1`}>

          {/* Password Gate */}
          {!isAdminAuthenticated ? (
            <div className="py-6 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mx-auto"><Lock className="w-7 h-7" /></div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Admin Access Required</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Sign in with your authorized administrator account to manage the portal.</p>
              </div>
              {adminError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold text-center">{adminError}</div>
              )}
              <form onSubmit={handleAdminLogin} className="space-y-3 max-w-sm mx-auto">
                <input type="email" required placeholder="Admin email" value={adminEmailInput} onChange={(e) => { setAdminEmailInput(e.target.value); setAdminError(''); }}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs" />
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Enter admin password" value={adminPasswordInput}
                    onChange={(e) => { setAdminPasswordInput(e.target.value); setAdminError(''); }}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md">Sign In Securely</button>
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

              {pageMode && (
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div><p className="text-[11px] font-bold uppercase tracking-widest text-amber-600">Control Center</p><h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">Manage Student Opportunities</h1><p className="text-xs text-slate-500 mt-1">Publish verified jobs, scholarships, and alerts from one workspace.</p></div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Administrator access active</span>
                </div>
              )}

              {pageMode && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900"><p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Total listings</p><p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{opportunities.length}</p></div>
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900"><p className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold">Job notifications</p><p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{opportunities.filter(item => item.type === 'job').length}</p></div>
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900"><p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Scholarships</p><p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{opportunities.filter(item => item.type === 'scholarship').length}</p></div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  ['overview', 'Overview', LayoutDashboard],
                  ['jobs', 'Job Notifications', BriefcaseBusiness],
                  ['scholarships', 'Scholarships', GraduationCap],
                  ['notifications', 'Broadcasts', Bell],
                ].map(([key, label, Icon]) => (
                  <button key={key} onClick={() => setActiveSection(key)} className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold border transition-colors ${activeSection === key ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'}`}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>

              {activeSection === 'notifications' ? (
                <div className="space-y-4">
                  <form onSubmit={handleNotificationSubmit} className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><Send className="w-4 h-4 text-amber-600" />Create job or scholarship alert</div>
                    <input required placeholder="Notification title" value={notificationForm.title} onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
                    <textarea required rows="3" placeholder="Write the alert message..." value={notificationForm.message} onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select value={notificationForm.audience} onChange={(e) => setNotificationForm({ ...notificationForm, audience: e.target.value })} className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"><option>All Students</option><option>Job Seekers</option><option>Scholarship Applicants</option></select>
                      <button type="submit" className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs">Publish Alert</button>
                    </div>
                  </form>
                  {notifications.length === 0 ? <p className="text-center text-xs text-slate-500 py-8">No notifications published yet.</p> : notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div><p className="text-xs font-bold text-slate-900 dark:text-white">{notification.title}</p><p className="text-[11px] text-slate-500 mt-1">{notification.message}</p><span className="text-[10px] text-amber-700 dark:text-amber-400">{notification.audience}</span></div>
                      <button onClick={() => onDeleteNotification?.(notification.id)} title="Delete notification" className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              ) : (<div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input type="text" placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleShareWhatsApp}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm whitespace-nowrap">
                    <span>Share New Updates on WhatsApp</span>
                  </button>
                  <button onClick={openAddForm}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm whitespace-nowrap">
                    <PlusCircle className="w-4 h-4" /><span>Add New Listing</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">{sectionOpps.length} {activeSection === 'jobs' ? 'job notification' : activeSection === 'scholarships' ? 'scholarship' : 'listing'}{sectionOpps.length !== 1 ? 's' : ''} total</p>

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
                {sectionOpps.map((item) => (
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

              </div>)}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
