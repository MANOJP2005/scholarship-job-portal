import React from 'react';
import { Bookmark, BookmarkCheck, ArrowRight, Award, Briefcase, GraduationCap, Zap, Lock } from 'lucide-react';

export default function OpportunityCard({ item, isBookmarked, onToggleBookmark, onSelect, user }) {
  const calculateDaysLeft = (deadlineStr) => {
    const today = new Date();
    const target = new Date(deadlineStr);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(item.deadline);

  const getDeadlineBadge = () => {
    if (daysLeft < 0) return { text: 'Expired', cls: 'bg-stone-100 dark:bg-slate-800 text-stone-400 border-stone-200' };
    if (daysLeft <= 10) return { text: `🔥 ${daysLeft}d left`, cls: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 animate-pulse' };
    if (daysLeft <= 25) return { text: `⏳ ${daysLeft}d left`, cls: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
    return { text: `📅 ${daysLeft}d left`, cls: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
  };

  const deadlineBadge = getDeadlineBadge();

  const aiMatchScore = (() => {
    if (!user) return null;
    let s = 80;
    if (item.qualification.toLowerCase().includes(user.educationLevel.toLowerCase())) s += 15;
    return Math.min(98, s + (item.id.length % 5));
  })();

  return (
    <div className="group card-surface rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between hover:scale-[1.01]">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-xl ${item.logoBg || 'bg-amber-600 text-white'} flex items-center justify-center font-extrabold text-[10px] tracking-wider shadow-sm flex-shrink-0`}>
              {item.logoText || 'VS'}
            </div>
            <div>
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  item.type === 'job'
                    ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                }`}>{item.type === 'job' ? 'Govt Job' : 'Scholarship'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400">{item.category}</span>
                {aiMatchScore && <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white flex items-center"><Zap className="w-2.5 h-2.5 mr-0.5"/>{aiMatchScore}%</span>}
              </div>
              <p className="text-[11px] font-medium text-stone-400 dark:text-slate-500 mt-0.5 line-clamp-1">{item.organization}</p>
            </div>
          </div>
          {user && (
            <button onClick={() => onToggleBookmark(item.id)}
              className={`p-2 rounded-xl border transition-colors flex-shrink-0 ${
                isBookmarked ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200 dark:border-amber-800' : 'bg-stone-50 dark:bg-slate-800/60 text-stone-300 hover:text-stone-500 border-stone-200 dark:border-slate-700'
              }`}>
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>

        <h3 onClick={() => onSelect(item)}
          className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer transition-colors leading-snug mb-3">
          {item.title}
        </h3>

        <div className="mb-3 p-2.5 rounded-xl bg-stone-50/80 dark:bg-slate-800/40 border border-stone-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            {item.type === 'job' ? <><Briefcase className="w-3.5 h-3.5 text-sky-500" /><span>{item.vacancies}</span></> : <><Award className="w-3.5 h-3.5 text-emerald-500" /><span>{item.stipendSalary}</span></>}
          </div>
          <div className="flex items-center space-x-1 text-[11px] font-medium text-stone-400 dark:text-slate-500">
            <GraduationCap className="w-3.5 h-3.5" /><span>{item.qualification}</span>
          </div>
        </div>

        <p className="text-[11px] text-stone-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
      </div>

      <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${deadlineBadge.cls}`}>{deadlineBadge.text}</div>
        <button onClick={() => onSelect(item)}
          className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors">
          {!user && <Lock className="w-3 h-3 mr-0.5 text-stone-400" />}
          <span>{user ? 'View & Apply' : 'View Details'}</span><ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
