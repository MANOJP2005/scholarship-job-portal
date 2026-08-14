import React, { useState, useCallback } from 'react';
import { X, UploadCloud, FileText, Trash2, Sparkles, Briefcase, GraduationCap, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// Keywords for matching
const EDUCATION_KEYWORDS = {
  '10th Pass': ['10th', 'ssc', 'secondary', 'class 10', 'class x', 'matric', 'tenth'],
  '12th Pass': ['12th', 'inter', 'intermediate', 'higher secondary', 'class 12', 'class xii', 'hsc', 'twelfth', '+2', 'plus two'],
  'Diploma / ITI': ['diploma', 'iti', 'polytechnic', 'industrial training'],
  'B.E. / B.Tech': ['b.tech', 'btech', 'b.e', 'bachelor of engineering', 'bachelor of technology', 'engineering'],
  'Degree (B.Sc/B.Com/B.A)': ['b.sc', 'bsc', 'b.com', 'bcom', 'b.a', 'bachelor of science', 'bachelor of commerce', 'bachelor of arts', 'bca', 'bba', 'degree'],
  'Post Graduate': ['m.tech', 'mtech', 'm.sc', 'msc', 'mba', 'mca', 'm.com', 'post graduate', 'master', 'pg'],
};

const BRANCH_KEYWORDS = {
  'Computer Science': ['computer science', 'cse', 'cs', 'software', 'programming', 'coding', 'java', 'python', 'c++', 'html', 'web development', 'data structure', 'algorithm', 'information technology', 'it'],
  'Electronics': ['electronics', 'ece', 'eee', 'electrical', 'vlsi', 'embedded', 'circuit', 'signal processing'],
  'Mechanical': ['mechanical', 'mech', 'thermodynamics', 'manufacturing', 'automobile', 'cad', 'cam'],
  'Civil': ['civil', 'structural', 'construction', 'building', 'surveying', 'geotechnical'],
  'Commerce': ['commerce', 'accounting', 'finance', 'economics', 'business', 'tally', 'gst', 'taxation', 'audit'],
  'Science': ['physics', 'chemistry', 'biology', 'mathematics', 'maths', 'zoology', 'botany', 'science'],
  'Arts': ['arts', 'history', 'geography', 'political science', 'sociology', 'philosophy', 'literature', 'english', 'hindi'],
};

const JOB_KEYWORDS = ['railway', 'rrb', 'bank', 'sbi', 'ibps', 'ssc', 'isro', 'drdo', 'upsc', 'defence', 'navy', 'army', 'air force', 'police', 'constable', 'clerk', 'po', 'technician', 'apprentice', 'trainee', 'scientist', 'engineer'];

export default function ResumeMatcherModal({ isOpen, onClose, user, opportunities, onSelectOpportunity }) {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [extractedProfile, setExtractedProfile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState(null);

  if (!isOpen) return null;

  // Extract text from PDF using pdf.js
  const extractTextFromPDF = async (arrayBuffer) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      return fullText;
    } catch (err) {
      throw new Error('Could not read this PDF. Make sure it contains selectable text (not a scanned image).');
    }
  };

  // Analyze extracted text to build a profile
  const analyzeText = (text) => {
    const lower = text.toLowerCase();
    const profile = {
      detectedEducation: [],
      detectedBranch: [],
      detectedJobInterests: [],
      rawTextPreview: text.substring(0, 500),
    };

    // Detect education levels
    for (const [level, keywords] of Object.entries(EDUCATION_KEYWORDS)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          if (!profile.detectedEducation.includes(level)) {
            profile.detectedEducation.push(level);
          }
          break;
        }
      }
    }

    // Detect branches
    for (const [branch, keywords] of Object.entries(BRANCH_KEYWORDS)) {
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          if (!profile.detectedBranch.includes(branch)) {
            profile.detectedBranch.push(branch);
          }
          break;
        }
      }
    }

    // Detect job interests
    for (const kw of JOB_KEYWORDS) {
      if (lower.includes(kw) && !profile.detectedJobInterests.includes(kw)) {
        profile.detectedJobInterests.push(kw);
      }
    }

    return profile;
  };

  // Match opportunities based on extracted profile
  const findMatches = (profile) => {
    const today = new Date();
    const results = [];

    for (const opp of opportunities) {
      let score = 0;
      const oppLower = (opp.title + ' ' + opp.category + ' ' + opp.qualification + ' ' + opp.organization + ' ' + (opp.description || '')).toLowerCase();

      // Education level match (+35)
      for (const edu of profile.detectedEducation) {
        if (opp.qualification.toLowerCase().includes(edu.toLowerCase().split(' ')[0])) {
          score += 35;
          break;
        }
        if (opp.allowedDegrees) {
          for (const deg of opp.allowedDegrees) {
            if (deg.toLowerCase().includes(edu.toLowerCase().split(' ')[0])) {
              score += 30;
              break;
            }
          }
          if (score > 0) break;
        }
      }

      // Also match from user profile education
      if (score === 0 && user && user.educationLevel) {
        const userEdu = user.educationLevel.toLowerCase();
        if (opp.qualification.toLowerCase().includes(userEdu.split(' ')[0]) ||
            (opp.allowedDegrees && opp.allowedDegrees.some(d => d.toLowerCase().includes(userEdu.split(' ')[0])))) {
          score += 25;
        }
      }

      // Branch/stream match (+20)
      for (const branch of profile.detectedBranch) {
        const branchKeywords = BRANCH_KEYWORDS[branch] || [];
        for (const bk of branchKeywords) {
          if (oppLower.includes(bk)) {
            score += 20;
            break;
          }
        }
        if (score >= 55) break;
      }

      // Job interest keywords match (+15)
      for (const jk of profile.detectedJobInterests) {
        if (oppLower.includes(jk)) {
          score += 15;
          break;
        }
      }

      // Deadline is still open (+10)
      const deadline = new Date(opp.deadline);
      if (deadline >= today) {
        score += 10;
      }

      if (score >= 25) {
        results.push({ ...opp, matchScore: Math.min(score, 100) });
      }
    }

    results.sort((a, b) => b.matchScore - a.matchScore);
    return results;
  };

  // Handle file upload
  const handleFileUpload = async (uploadedFile) => {
    setError('');
    setMatches(null);
    setExtractedProfile(null);
    setExtractedText('');

    // Validate file type
    const allowedTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];
    const fileName = uploadedFile.name.toLowerCase();
    const isAllowed = allowedTypes.includes(uploadedFile.type) || allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
      setError('Please upload a PDF file only. Your resume or marksheet must be in PDF format.');
      return;
    }

    // Validate file size (max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const text = await extractTextFromPDF(arrayBuffer);

      if (!text || text.trim().length < 20) {
        setError('Could not extract text from this PDF. It may be a scanned image. Please upload a text-based PDF resume or marksheet.');
        setIsProcessing(false);
        setFile(null);
        return;
      }

      setExtractedText(text);
      const profile = analyzeText(text);
      setExtractedProfile(profile);

      if (profile.detectedEducation.length === 0 && profile.detectedBranch.length === 0) {
        setError('Could not detect education details from this file. Please ensure your resume or marksheet contains your qualification information (e.g., B.Tech, 12th Pass, Diploma, etc.).');
        setIsProcessing(false);
        return;
      }

      const matchResults = findMatches(profile);
      setMatches(matchResults);
    } catch (err) {
      setError(err.message || 'Failed to process the file. Please try a different PDF.');
      setFile(null);
    }

    setIsProcessing(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileUpload(droppedFile);
  }, []);

  const handleClear = () => {
    setFile(null);
    setExtractedText('');
    setExtractedProfile(null);
    setMatches(null);
    setError('');
  };

  const matchedJobs = matches ? matches.filter(m => m.type === 'job') : [];
  const matchedScholarships = matches ? matches.filter(m => m.type === 'scholarship') : [];

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
    if (score >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="text-base font-bold">AI Resume & Marksheet Matcher</h3>
              <p className="text-[10px] text-emerald-200 mt-0.5">Upload your PDF resume or marksheet — we'll find matching opportunities</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/20"><X className="w-5 h-5" /></button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Zone */}
          {!file && !isProcessing && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('resume-upload-input').click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 sm:p-10 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all group"
            >
              <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 mx-auto mb-3 transition-colors" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Drop your Resume or Marksheet PDF here</h4>
              <p className="text-xs text-slate-500">or click to browse • PDF files only • Max 10MB</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">✓ Resume PDF</span>
                <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">✓ Marksheet PDF</span>
                <span className="px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 text-[10px] font-bold border border-red-200 dark:border-red-800">✗ Images / Random files</span>
              </div>
              <input
                id="resume-upload-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); }}
              />
            </div>
          )}

          {/* Processing */}
          {isProcessing && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-emerald-500 mx-auto animate-spin" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Reading your document...</h4>
              <p className="text-xs text-slate-500">Extracting education details, skills, and qualifications</p>
            </div>
          )}

          {/* Uploaded File Info */}
          {file && !isProcessing && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{file.name}</p>
                  <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button onClick={handleClear} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Extracted Profile Summary */}
          {extractedProfile && !isProcessing && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <h4 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile Detected from Your Document</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="block text-[10px] font-bold text-emerald-700/70 dark:text-emerald-400/70 uppercase">Education</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {extractedProfile.detectedEducation.length > 0 ? extractedProfile.detectedEducation.join(', ') : 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-emerald-700/70 dark:text-emerald-400/70 uppercase">Branch/Stream</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {extractedProfile.detectedBranch.length > 0 ? extractedProfile.detectedBranch.join(', ') : 'Not detected'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-emerald-700/70 dark:text-emerald-400/70 uppercase">Job Interests</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {extractedProfile.detectedJobInterests.length > 0 ? extractedProfile.detectedJobInterests.join(', ') : 'General'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Match Results */}
          {matches && !isProcessing && (
            <div className="space-y-5">
              {matches.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Strong Matches Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">Your document didn't match any current listings strongly. Try uploading a different resume or update your profile details.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-500">Found {matches.length} matching opportunities based on your document</p>

                  {/* Jobs Section */}
                  {matchedJobs.length > 0 && (
                    <div>
                      <h4 className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Matching Govt Jobs ({matchedJobs.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {matchedJobs.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex-1 min-w-0 pr-3">
                              <div className="flex items-center space-x-2 mb-0.5">
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${getScoreColor(item.matchScore)}`}>
                                  {item.matchScore}% Match
                                </span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">{item.organization} • {item.qualification} • Deadline: {item.deadline}</p>
                            </div>
                            <button onClick={() => { onClose(); setTimeout(() => onSelectOpportunity(item), 200); }}
                              className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 flex-shrink-0">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scholarships Section */}
                  {matchedScholarships.length > 0 && (
                    <div>
                      <h4 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Matching Scholarships ({matchedScholarships.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {matchedScholarships.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex-1 min-w-0 pr-3">
                              <div className="flex items-center space-x-2 mb-0.5">
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${getScoreColor(item.matchScore)}`}>
                                  {item.matchScore}% Match
                                </span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate">{item.organization} • {item.stipendSalary} • Deadline: {item.deadline}</p>
                            </div>
                            <button onClick={() => { onClose(); setTimeout(() => onSelectOpportunity(item), 200); }}
                              className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 flex-shrink-0">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
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
