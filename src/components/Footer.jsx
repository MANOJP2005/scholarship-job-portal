import React from 'react';
import { GraduationCap, Heart, ShieldAlert, Send, Globe, Mail } from 'lucide-react';

export default function Footer({ onOpenDocs, onOpenNewsletter }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">VIDYASUDDHI</span>
            </div>
            <p className="text-amber-400/90 text-[11px] font-medium leading-relaxed italic">
              Where Academic Sponsorship Meets Elite Recruitment.
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              India's premier portal for 10th, 12th, Diploma, B.Tech & Degree students to track active scholarships, RRB Railway, Banking, SSC & ISRO job notifications.
            </p>
            <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                Pan-India Access
              </span>
              <a 
                href="mailto:help@vidyasuddhi.edu.in" 
                className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                Contact Helpdesk
              </a>
            </div>
          </div>

          {/* Govt Recruitments Column */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Govt Recruitments</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#" className="hover:text-amber-400 transition-colors">RRB NTPC & ALP Railway</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">SBI PO & IBPS Clerk</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">SSC CGL & CHSL Exams</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">ISRO & DRDO Technical</a></li>
            </ul>
          </div>

          {/* Scholarship Schemes Column */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Scholarship Schemes</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Sitaram Jindal Foundation</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">National Scholarship Portal (NSP)</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Reliance Foundation UG Grant</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Tata Technical Scholarships</a></li>
            </ul>
          </div>

          {/* Stay Connected Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Stay Connected</h4>
            <p className="text-[11px] text-slate-500">Get daily exam updates and scholarship alerts directly on your mobile.</p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={onOpenNewsletter} 
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center space-x-1.5 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join Alert Group</span>
              </button>
              <button 
                onClick={onOpenDocs} 
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition-colors"
              >
                Dev Setup
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>Disclaimer: All official logos and notices belong to their respective government boards & foundations. Always verify on official portals.</span>
          </div>
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for Indian Aspirants • VIDYASUDDHI © 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
