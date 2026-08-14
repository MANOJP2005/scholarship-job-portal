import React, { useState } from 'react';
import { X, Bell, Send, CheckCircle2, MessageCircle, Mail } from 'lucide-react';

export default function NewsletterModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 text-white">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>

          <h3 className="text-xl font-extrabold">Instant Exam & Stipend Alerts</h3>
          <p className="text-xs text-emerald-100 mt-1">Get instant mobile notifications as soon as official PDFs are published.</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Social Channels */}
          <div className="space-y-2.5">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-sky-700 dark:text-sky-300 text-xs font-bold transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <Send className="w-4 h-4 text-sky-500" />
                <span>Join Official Telegram Channel</span>
              </div>
              <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded-md">24k Students</span>
            </a>

            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Join WhatsApp Updates Group</span>
              </div>
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-md">Active</span>
            </a>
          </div>

          <div className="relative flex items-center my-3">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400">or get daily email digest</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Email Subscription Form */}
          {subscribed ? (
            <div className="text-center py-4 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Subscribed Successfully!</p>
              <p className="text-[11px] text-slate-500">You will receive daily opportunity digests at {email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Subscribe For Free Daily Alerts
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
