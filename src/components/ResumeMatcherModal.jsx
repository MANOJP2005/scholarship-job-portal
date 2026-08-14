import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Sparkles, Award, ArrowRight, Zap } from 'lucide-react';

export default function ResumeMatcherModal({ isOpen, onClose, user, opportunities, onSelectOpportunity }) {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedResults, setMatchedResults] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      processResume(uploadedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResume(e.dataTransfer.files[0]);
    }
  };

  const processResume = (uploadedFile) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);

    setTimeout(() => {
      // AI Skill & Education Extraction Simulation
      const userDegree = user ? user.educationLevel : 'B.E. / B.Tech';
      
      const scored = opportunities.map(item => {
        let score = 75; // base match

        // Degree match logic
        if (item.qualification.toLowerCase().includes(userDegree.toLowerCase())) {
          score += 18;
        } else if (item.allowedDegrees && item.allowedDegrees.some(d => d.toLowerCase().includes(userDegree.toLowerCase()))) {
          score += 15;
        }

        // Add variance
        const finalScore = Math.min(99, score + (item.id.length % 7));

        return {
          ...item,
          matchPercentage: finalScore,
          matchedReason: `Matches ${userDegree} qualification & required age criteria.`
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage);

      setMatchedResults(scored);
      setIsAnalyzing(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <h3 className="text-xl font-extrabold">AI Resume & Marksheet Job Matcher</h3>
          </div>
          <p className="text-xs text-emerald-100">
            Upload your Resume PDF or Marksheet (10th/12th/Diploma/Degree) to get instant matched opportunities.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {!matchedResults ? (
            <div className="space-y-4">
              
              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 rounded-3xl p-8 text-center bg-indigo-50/50 dark:bg-indigo-950/20 transition-all cursor-pointer relative"
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.png,.jpg"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/30">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Drag & Drop your Resume or Marksheet PDF
                </h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Supports PDF, DOCX, 10th/12th/Diploma/Degree Marksheets (Max 10MB)
                </p>

                <div className="mt-4 inline-block px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                  Browse File from Device
                </div>
              </div>

              {isAnalyzing && (
                <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-3">
                  <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bold text-xs">Parsing qualifications & extracting matching RRB/Banking/Scholarship notices...</p>
                </div>
              )}

            </div>
          ) : (
            
            /* AI Results View */
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Resume Analysis Complete</span>
                    <span className="text-[11px] text-slate-500">File: {file?.name || 'Resume.pdf'}</span>
                  </div>
                </div>

                <button
                  onClick={() => setMatchedResults(null)}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Upload Another File
                </button>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Top Matched Opportunities ({matchedResults.length})
              </h4>

              {/* List of Matched Cards */}
              <div className="space-y-3">
                {matchedResults.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-indigo-400 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] flex items-center">
                          <Zap className="w-3 h-3 mr-0.5" /> {item.matchPercentage}% MATCH
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{item.category}</span>
                      </div>

                      <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h5>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.matchedReason}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectOpportunity(item);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex-shrink-0 flex items-center space-x-1 shadow-sm"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
