import React from 'react';
import { Award, Briefcase, IndianRupee, Clock } from 'lucide-react';

export default function StatsBanner({ totalCount, jobCount, scholarshipCount }) {
  const stats = [
    { icon: Briefcase, color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border-sky-200/80 dark:border-sky-800', value: `${jobCount * 3800}+`, label: 'Active Govt Vacancies', subtext: 'RRB, SSC, Banking & PSUs' },
    { icon: Award, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800', value: '₹2.5L / Yr', label: 'Max Scholarship Stipend', subtext: 'Merit & Technical Grants' },
    { icon: IndianRupee, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800', value: '100% Free', label: 'Student Application', subtext: 'Direct Official Govt Links' },
    { icon: Clock, color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-800', value: 'Daily 9AM', label: 'Verified Update', subtext: 'Scraped & Curated Data' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="card-surface p-4 rounded-xl flex items-start space-x-3">
              <div className={`p-2.5 rounded-xl border ${item.color}`}><Icon className="w-5 h-5" /></div>
              <div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{item.value}</div>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{item.label}</div>
                <div className="text-[10px] text-stone-400 dark:text-slate-500">{item.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
