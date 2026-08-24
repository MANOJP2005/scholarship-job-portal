import React, { useState } from 'react';
import { X, ExternalLink, Download, Calendar, CheckCircle2, FileText, Bookmark, BookmarkCheck, Share2, AlertCircle, Building2, GraduationCap, Lock } from 'lucide-react';

export default function OpportunityModal({ item, onClose, isBookmarked, onToggleBookmark, user, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('eligibility');
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2500); };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><X className="w-5 h-5" /></button>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${item.type === 'job' ? 'bg-amber-500 text-white' : item.type === 'loan' ? 'bg-sky-500 text-white' : item.type === 'interest-subsidy' ? 'bg-amber-500 text-white' : item.type === 'financial-aid' ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white'}`}>{item.type === 'job' ? 'Govt Job Recruitment' : item.type === 'loan' ? 'Education Loan' : item.type === 'interest-subsidy' ? 'Interest Subsidy' : item.type === 'financial-aid' ? 'Financial Aid' : 'Scholarship Opportunity'}</span>
            <span className="text-[11px] font-medium text-slate-400">{item.category}</span>
            {item.status && <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white/15 text-white">{item.status}</span>}
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight pr-8 leading-snug">{item.title}</h2>
          <p className="text-xs text-slate-300 mt-1 flex items-center"><Building2 className="w-3.5 h-3.5 mr-1 text-amber-400" />{item.organization}</p>
          {item.type === 'job' && <p className="text-[10px] text-slate-400 mt-2">Last verified: {item.lastVerified} · Eligibility: {item.eligibilityAudience}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
            <div><span className="block text-[10px] text-slate-500 uppercase">{item.type === 'job' ? 'Vacancies' : item.type === 'loan' ? 'Loan Benefit' : item.type === 'interest-subsidy' ? 'Subsidy Benefit' : item.type === 'financial-aid' ? 'Support' : 'Grant Value'}</span><span className="font-bold text-amber-400">{item.type === 'job' ? item.vacancies : item.stipendSalary}</span></div>
            <div><span className="block text-[10px] text-slate-500 uppercase">Qualification</span><span className="font-bold text-white flex items-center"><GraduationCap className="w-3 h-3 mr-1"/> {item.qualification}</span></div>
            <div><span className="block text-[10px] text-slate-500 uppercase">Deadline</span><span className="font-bold text-amber-400 flex items-center"><Calendar className="w-3 h-3 mr-1"/> {item.deadline}</span></div>
            <div><span className="block text-[10px] text-slate-500 uppercase">Location</span><span className="font-bold text-white truncate">{item.location || 'India'}</span></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/80 px-6 pt-2 flex-shrink-0">
          {(item.type === 'job' ? ['eligibility','selection','pdf'] : ['eligibility','pdf']).map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all capitalize ${activeTab===tab?'border-amber-600 text-amber-700 dark:text-amber-400':'border-transparent text-stone-400 hover:text-slate-800 dark:hover:text-white'}`}>
              {tab === 'eligibility' ? 'Overview & Eligibility' : tab === 'selection' ? 'Selection & Syllabus' : 'Official Links & Fee'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 dark:text-slate-200">
          {activeTab === 'eligibility' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">Description</h4>
                <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed bg-stone-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-stone-100 dark:border-slate-800">{item.description}</p>
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">Eligibility Criteria</h4>
                <ul className="space-y-2">{item.eligibilityDetails?.map((p,i)=>(<li key={i} className="flex items-start space-x-2.5 text-xs text-stone-600 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"/><span>{p}</span></li>))}</ul>
              </div>
              {item.allowedDegrees && (<div><h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">Eligible Degrees</h4><div className="flex flex-wrap gap-2">{item.allowedDegrees.map((d,i)=>(<span key={i} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800"><GraduationCap className="w-3 h-3 inline mr-1"/>{d}</span>))}</div></div>)}
              <div className={`grid grid-cols-1 ${item.type === 'job' ? 'sm:grid-cols-2' : ''} gap-3`}>
                {item.type === 'job' && <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700"><span className="block text-[10px] text-stone-400 uppercase font-bold">Age Limit</span><span className="text-xs font-bold text-slate-900 dark:text-white">{item.ageLimit}</span></div>}
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700"><span className="block text-[10px] text-stone-400 uppercase font-bold">{item.type === 'job' ? 'Salary' : item.type === 'scholarship' ? 'Award Amount' : 'Benefit'}</span><span className="text-xs font-bold text-slate-900 dark:text-white">{item.stipendSalary}</span></div>
              </div>
              {item.type === 'scholarship' && (
                <div className="space-y-4">
                  {item.scholarshipProvider && <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900"><span className="block text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">Scholarship Provider</span><span className="text-xs font-bold text-slate-900 dark:text-white">{item.scholarshipProvider}</span></div>}
                  {item.incomeLimit && <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700"><span className="block text-[10px] text-stone-400 uppercase font-bold">Family Income Limit</span><span className="text-xs font-bold text-slate-900 dark:text-white">{item.incomeLimit}</span></div>}
                  {[['Benefits', item.benefits], ['Required Documents', item.requiredDocuments], ['Application Steps', item.applicationSteps]].map(([heading, values]) => values?.length > 0 && <div key={heading}><h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">{heading}</h4><ul className="space-y-2">{values.map((value, index) => <li key={index} className="flex items-start gap-2 text-xs text-stone-600 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><span>{value}</span></li>)}</ul></div>)}
                </div>
              )}
              {item.type === 'loan' && item.benefits?.length > 0 && (
                <div><h4 className="text-xs font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-2">Portal Features</h4><ul className="space-y-2">{item.benefits.map((value, index) => <li key={index} className="flex items-start gap-2 text-xs text-stone-600 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" /><span>{value}</span></li>)}</ul></div>
              )}
              {(item.type === 'loan' || item.type === 'interest-subsidy' || item.type === 'financial-aid') && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900"><span className="block text-[10px] text-sky-700 dark:text-sky-400 uppercase font-bold">Income / Condition</span><span className="text-xs font-bold text-slate-900 dark:text-white">{item.incomeLimit}</span></div><div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900"><span className="block text-[10px] text-sky-700 dark:text-sky-400 uppercase font-bold">Interest / Collateral</span><span className="text-xs font-bold text-slate-900 dark:text-white">{item.interestRate} · {item.collateral}</span></div></div>}
            </div>
          )}

          {activeTab === 'selection' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">Selection Process</h4>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-amber-200 dark:before:bg-amber-900">
                  {item.selectionProcess?.map((step,i)=>(<div key={i} className="relative flex items-start space-x-3 pl-8"><div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-amber-600 border-2 border-white dark:border-slate-900"/><div><span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">Step {i+1}</span><p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">{step}</p></div></div>))}
                </div>
              </div>
              {item.syllabusHighlights && (<div><h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">Key Exam Subjects</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{item.syllabusHighlights.map((s,i)=>(<div key={i} className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-xs font-medium flex items-center"><FileText className="w-3.5 h-3.5 text-amber-500 mr-2"/><span>{s}</span></div>))}</div></div>)}
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div><span className="font-bold block">Application Fee</span><span>{item.applicationFee}</span></div>
              </div>

              {user && item.status !== 'RESTRICTED' && item.status !== 'CLOSED' ? (
                <div className="space-y-3">
                  <a href={item.officialUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full p-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-amber-600/15 transition-all">
                    <div className="flex items-center space-x-2"><ExternalLink className="w-4 h-4" /><span>Open Official Application Portal</span></div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">External Site</span>
                  </a>
                  <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full p-4 rounded-2xl bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-between border border-stone-200 dark:border-slate-700 transition-all">
                    <div className="flex items-center space-x-2"><Download className="w-4 h-4 text-emerald-500" /><span>Download Official PDF Notification</span></div>
                    <span className="text-[10px] bg-stone-200 dark:bg-slate-700 px-2 py-0.5 rounded text-stone-600 dark:text-slate-300">PDF</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={() => { onClose(); setTimeout(() => onOpenAuth(), 200); }}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center justify-between border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all group">
                    <div className="flex items-center space-x-2"><Lock className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" /><span>Open Official Application Portal</span></div>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">Log in for Free to Unlock</span>
                  </button>
                  <button onClick={() => { onClose(); setTimeout(() => onOpenAuth(), 200); }}
                    className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center justify-between border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all group">
                    <div className="flex items-center space-x-2"><Lock className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" /><span>Download Official PDF Notification</span></div>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">Log in for Free to Unlock</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-slate-900/90 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <button onClick={() => onToggleBookmark(item.id)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center space-x-1.5 transition-colors ${isBookmarked ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 border-amber-200 dark:border-amber-800' : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 border-stone-300 dark:border-slate-700'}`}>
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}<span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
            <button onClick={handleShare} className="px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-stone-600 dark:text-slate-300 border border-stone-300 dark:border-slate-700 flex items-center space-x-1.5">
              <Share2 className="w-4 h-4" /><span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
          {user && item.status !== 'RESTRICTED' && item.status !== 'CLOSED' ? (
            <a href={item.officialUrl} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-md flex items-center space-x-1.5">
              <span>{item.status === 'EXAM STAGE' ? 'View Exam Details' : 'Apply Now'}</span><ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button onClick={() => { onClose(); setTimeout(() => onOpenAuth(), 200); }}
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-400 dark:bg-slate-700 hover:bg-amber-600 dark:hover:bg-amber-600 rounded-xl shadow-md flex items-center space-x-1.5 transition-colors">
              <Lock className="w-3.5 h-3.5" /><span>Sign In to Apply</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
