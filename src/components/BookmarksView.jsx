import React from 'react';
import { Bookmark, ArrowLeft, Trash2 } from 'lucide-react';
import OpportunityCard from './OpportunityCard';

export default function BookmarksView({ bookmarkedItems, onToggleBookmark, onSelect, onBackToFeed }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToFeed}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Saved Opportunities</span>
            </h2>
            <p className="text-xs text-slate-500">Track application deadlines for your saved scholarships & exam notifications.</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
          {bookmarkedItems.length} Saved Item{bookmarkedItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid or Empty State */}
      {bookmarkedItems.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Saved Opportunities Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Click the bookmark icon on any RRB Railway, Bank PO, or Scholarship card to keep track of its upcoming deadline!
          </p>
          <button
            onClick={onBackToFeed}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
          >
            Browse All Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedItems.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

    </div>
  );
}
