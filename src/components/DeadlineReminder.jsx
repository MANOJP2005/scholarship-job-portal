import React, { useEffect } from 'react';
import { X, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function DeadlineReminder({ items, onDismiss, onSelectItem }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 15000); // 15 seconds auto dismiss
    
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!items || items.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-30 max-w-sm w-full shadow-2xl transition-transform duration-500 translate-x-0" style={{ animation: 'slideIn 0.3s ease-out' }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div className="bg-white dark:bg-slate-900 rounded-xl border-l-4 border-l-amber-500 border-t border-r border-b border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-500 font-bold text-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>⏰ Upcoming Deadlines!</span>
          </div>
          <button 
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 max-h-60 overflow-y-auto space-y-2">
          {items.map(item => (
            <div key={item.id} className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{item.title}</h4>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                  item.type === 'job' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400'
                }`}>
                  {item.type === 'job' ? 'JOB' : 'SCHOLARSHIP'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[10px] text-red-500 font-bold">
                  <AlertCircle className="w-3 h-3" />
                  <span>Expires: {item.deadline}</span>
                </div>
                <button 
                  onClick={() => onSelectItem(item)}
                  className="flex items-center space-x-1 text-[10px] font-bold text-amber-600 hover:text-amber-700"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
