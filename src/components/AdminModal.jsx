import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { categoryOptions, qualificationOptions } from '../data/mockData';

export default function AdminModal({ isOpen, onClose, onAddOpportunity, userRole, setUserRole }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'job',
    category: 'RRB Railway',
    organization: '',
    qualification: 'B.E. / B.Tech',
    vacancies: '',
    stipendSalary: '',
    applicationFee: 'Free',
    ageLimit: '18 - 30 Years',
    deadline: '',
    officialUrl: '',
    pdfUrl: '',
    description: '',
    eligibility1: '',
    eligibility2: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newOpportunity = {
      id: `custom-${Date.now()}`,
      title: formData.title || 'New Opportunity Listing',
      type: formData.type,
      category: formData.category,
      organization: formData.organization || 'Govt Department',
      logoText: formData.organization ? formData.organization.substring(0, 3).toUpperCase() : 'GOV',
      logoBg: formData.type === 'job' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white',
      qualification: formData.qualification,
      allowedDegrees: [formData.qualification, 'Diploma', 'Graduate', '10th Pass', '12th Pass'],
      vacancies: formData.type === 'job' ? (formData.vacancies || '1,000+ Posts') : 'N/A',
      stipendSalary: formData.stipendSalary || 'As per Govt Norms',
      applicationFee: formData.applicationFee,
      ageLimit: formData.ageLimit,
      deadline: formData.deadline || '2026-10-30',
      postedDate: new Date().toISOString().split('T')[0],
      location: 'India',
      officialUrl: formData.officialUrl || 'https://google.com',
      pdfUrl: formData.pdfUrl || 'https://google.com',
      description: formData.description || 'Verified job notice.',
      eligibilityDetails: [
        formData.eligibility1 || 'Educational qualification as per official notification.',
        formData.eligibility2 || 'Age limit and physical standards fulfilled.'
      ],
      selectionProcess: ['Written CBT / Screening Test', 'Document Verification'],
      syllabusHighlights: ['General Knowledge', 'Reasoning Ability', 'Domain Skills']
    };

    onAddOpportunity(newOpportunity);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5" />
            <h3 className="text-base font-bold">Recruiter & Admin Portal - Post Opportunity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {userRole !== 'admin' ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">You are currently in Student Mode</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Only College Representatives, Recruiters, and Admins can publish new listings. Switch your role to Recruiter Mode below.
                </p>
              </div>

              <button
                onClick={() => setUserRole('admin')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 inline-flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Switch to Recruiter / Admin Mode</span>
              </button>
            </div>
          ) : submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Listing Published Successfully!</h4>
              <p className="text-xs text-slate-500">It is now live on the portal and saved to local storage.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                  formData.type === 'job'
                    ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="job"
                    checked={formData.type === 'job'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="sr-only"
                  />
                  <span>🏛️ Govt Job Recruitment</span>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer text-center font-bold transition-all ${
                  formData.type === 'scholarship'
                    ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="type"
                    value="scholarship"
                    checked={formData.type === 'scholarship'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="sr-only"
                  />
                  <span>🎓 Scholarship Grant</span>
                </label>
              </div>

              {/* Title & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RRB Technician Grade 1 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization / Ministry *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Railway Recruitment Board"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Category & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {categoryOptions.filter(c => c !== "All Categories").map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Minimum Qualification</label>
                  <select
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {qualificationOptions.filter(q => q !== "All Qualifications").map((q, i) => (
                      <option key={i} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vacancies / Stipend & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {formData.type === 'job' ? 'Vacancies Count' : 'Grant Value / Amount'}
                  </label>
                  <input
                    type="text"
                    placeholder={formData.type === 'job' ? "e.g. 5,000 Vacancies" : "e.g. ₹50,000 / year"}
                    value={formData.type === 'job' ? formData.vacancies : formData.stipendSalary}
                    onChange={(e) => {
                      if (formData.type === 'job') setFormData({ ...formData, vacancies: e.target.value });
                      else setFormData({ ...formData, stipendSalary: e.target.value });
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Official URL */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Apply Link</label>
                <input
                  type="url"
                  placeholder="https://official-portal.gov.in"
                  value={formData.officialUrl}
                  onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Publish Listing
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
