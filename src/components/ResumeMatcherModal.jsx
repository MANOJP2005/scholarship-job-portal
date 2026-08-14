import React, { useState } from 'react';
import { X, UploadCloud, FileText, Trash2, Sparkles, Briefcase, GraduationCap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResumeMatcherModal({ isOpen, onClose, user, opportunities, onSelectOpportunity }) {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [matchedScholarships, setMatchedScholarships] = useState([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  if (!isOpen) return null;

  const extractTextFromFile = (uploadedFile) => {
    return new Promise((resolve) => {
      if (uploadedFile.type === 'application/pdf' || uploadedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve((e.target.result || '').toLowerCase());
        };
        reader.readAsText(uploadedFile);
      } else {
        // Image or other
        resolve(uploadedFile.name.toLowerCase());
      }
    });
  };

  const processResume = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setHasAnalyzed(false);

    const extractedTextRaw = await extractTextFromFile(uploadedFile);
    const textToAnalyze = extractedTextRaw + ' ' + uploadedFile.name.toLowerCase();

    // Wait for a short simulation delay
    setTimeout(() => {
      const keywords = [
        '10th', 'ssc', '12th', 'inter', 'diploma', 'iti', 'b.tech', 'b.e', 'btech', 'engineering', 'degree', 'b.sc', 'b.com', 'b.a', 'bca', 'mca', 'mba', 'm.tech', 'post graduate',
        'computer', 'cse', 'it', 'ece', 'eee', 'mechanical', 'civil', 'electrical', 'commerce', 'science', 'arts',
        'railway', 'rrb', 'bank', 'sbi', 'ibps', 'isro', 'drdo', 'upsc'
      ];
      
      const foundKeywords = keywords.filter(kw => textToAnalyze.includes(kw));
      
      const userLevel = user?.educationLevel?.toLowerCase() || '';
      const userArea = user?.studyArea?.toLowerCase() || '';
      
      const scoredOpportunities = opportunities.map(opp => {
        let score = 0;
        
        // +30 if qualification matches user's education level
        if (userLevel && opp.qualification.toLowerCase().includes(userLevel)) {
          score += 30;
        }
        
        // +20 if any extracted keyword matches the opportunity title or category
        const oppTitleCat = (opp.title + ' ' + opp.category).toLowerCase();
        if (foundKeywords.some(kw => oppTitleCat.includes(kw))) {
          score += 20;
        }
        
        // +20 if the opportunity's allowedDegrees includes the user's education level
        if (userLevel && opp.allowedDegrees && opp.allowedDegrees.some(d => d.toLowerCase().includes(userLevel))) {
          score += 20;
        }
        
        // +15 if branch/study area keywords match
        if (userArea && oppTitleCat.includes(userArea)) {
          score += 15;
        }
        
        // +15 if the opportunity is still open (deadline > today)
        if (new Date(opp.deadline) > new Date()) {
          score += 15;
        }
        
        return { ...opp, matchScore: score };
      });
      
      const matched = scoredOpportunities.filter(o => o.matchScore >= 30).sort((a, b) => b.matchScore - a.matchScore);
      
      setMatchedJobs(matched.filter(o => o.type === 'job'));
      setMatchedScholarships(matched.filter(o => o.type === 'scholarship'));
      
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) processResume(uploadedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResume(e.dataTransfer.files[0]);
    }
  };
  
  const handleRemove = () => {
    setFile(null);
    setMatchedJobs([]);
    setMatchedScholarships([]);
    setHasAnalyzed(false);
  };

  const getBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 50) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const renderOpportunityCard = (item) => (
    <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-indigo-400 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeColor(item.matchScore)}`}>
            {item.matchScore}% MATCH
          </span>
          <span className="text-[11px] font-bold text-slate-500">{item.organization}</span>
        </div>
        <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h5>
        <div className="flex items-center text-[11px] text-slate-500 space-x-3">
          <span>🎓 {item.qualification}</span>
          <span>⏳ {new Date(item.deadline).toLocaleDateString()}</span>
        </div>
      </div>
      <button
        onClick={() => {
          onClose();
          onSelectOpportunity(item);
        }}
        className="px-3.5 py-2 w-full sm:w-auto rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-sm"
      >
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-violet-700 text-white relative">
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <h3 className="text-xl font-extrabold">Smart AI Resume Matcher</h3>
          </div>
          <p className="text-xs text-indigo-100">
            Upload your resume or marksheet to instantly find the best jobs and scholarships matching your profile.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {/* File Upload / Display Zone */}
          {!file ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 rounded-2xl p-8 text-center bg-indigo-50/50 dark:bg-indigo-950/20 transition-all cursor-pointer relative"
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Upload your resume or marksheet to get personalized matches
              </h4>
              <p className="text-xs text-slate-500 mt-2">
                Drag & Drop or Click to Browse<br/>
                Supports PDF & Images (JPG, PNG)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{file.name}</p>
                  <p className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={handleRemove} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Analysis State */}
          {isAnalyzing && (
            <div className="py-8 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Extracting keywords & analyzing profile...</p>
            </div>
          )}

          {/* Results State */}
          {!isAnalyzing && hasAnalyzed && (
            <div className="space-y-6">
              {(matchedJobs.length === 0 && matchedScholarships.length === 0) ? (
                <div className="text-center py-6 px-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-900 dark:text-amber-500 text-sm">No strong matches found. Try updating your profile details.</p>
                </div>
              ) : (
                <>
                  {matchedJobs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span>🏛️ Matching Jobs</span>
                      </h4>
                      <div className="space-y-3">
                        {matchedJobs.map(renderOpportunityCard)}
                      </div>
                    </div>
                  )}

                  {matchedScholarships.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <span>🎓 Matching Scholarships</span>
                      </h4>
                      <div className="space-y-3">
                        {matchedScholarships.map(renderOpportunityCard)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
