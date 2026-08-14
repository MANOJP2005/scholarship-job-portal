import React from 'react';
import { Filter, RotateCcw, Calendar, BookOpen, Layers } from 'lucide-react';
import { categoryOptions, qualificationOptions } from '../data/mockData';

export default function FilterBar({
  activeTypeTab,
  setActiveTypeTab,
  selectedCategory,
  setSelectedCategory,
  selectedQualification,
  setSelectedQualification,
  urgencyFilter,
  setUrgencyFilter,
  onResetFilters,
  resultCount
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Top Header & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Smart Filters</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {resultCount} Opportunity{resultCount !== 1 ? 's' : ''} Found
            </span>
          </div>

          {/* Type Selector Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTypeTab('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTypeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setActiveTypeTab('job')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTypeTab === 'job'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Govt Jobs Only
            </button>
            <button
              onClick={() => setActiveTypeTab('scholarship')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTypeTab === 'scholarship'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Scholarships Only
            </button>
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center">
              <Layers className="w-3 h-3 mr-1 text-indigo-500" /> Exam / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {categoryOptions.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Qualification Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center">
              <BookOpen className="w-3 h-3 mr-1 text-emerald-500" /> Minimum Degree
            </label>
            <select
              value={selectedQualification}
              onChange={(e) => setSelectedQualification(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {qualificationOptions.map((qual, idx) => (
                <option key={idx} value={qual}>{qual}</option>
              ))}
            </select>
          </div>

          {/* Deadline / Urgency Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-amber-500" /> Deadline Status
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="all">All Dates</option>
              <option value="closing_soon">Closing Soon (&lt; 30 Days)</option>
              <option value="active">Active & Open</option>
            </select>
          </div>

        </div>

        {/* Reset Action */}
        {(selectedCategory !== "All Categories" || selectedQualification !== "All Qualifications" || urgencyFilter !== "all" || activeTypeTab !== "all") && (
          <div className="flex justify-end pt-1">
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
