import React, { useState } from 'react';
import { X, UserPlus, LogIn, CheckCircle2, User, Mail, Phone, Calendar, GraduationCap, BookOpen, Clock } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, user, onLogin, onRegister, onLogout }) {
  const [mode, setMode] = useState('register'); // 'login' | 'register'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  
  // Registration State (Support all education levels: 10th, 12th, Diploma, Degree, PG)
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    educationLevel: 'B.E. / B.Tech', // 10th Pass, 12th Pass, Diploma / ITI, B.E. / B.Tech, Degree (B.Sc/B.Com/B.A), Post Graduate
    studyArea: 'Computer Science & Engineering', // e.g. MPC, BiPC, CSE, IT, ECE, Mechanical, Commerce, General
    currentYear: '3rd Year', // 1st Year, 2nd Year, 3rd Year, Final Year, Passed Out / Job Seeker
    passingYear: '2026',
  });

  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    const newUserProfile = {
      id: `user-${Date.now()}`,
      ...formData,
      isLoggedIn: true,
      createdAt: new Date().toISOString()
    };

    onRegister(newUserProfile);
    setSuccessMsg('Account Created Successfully! Welcome to EduPath.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;

    const existingUser = {
      id: `user-existing`,
      fullName: loginEmail.split('@')[0],
      email: loginEmail,
      phone: '+91 9876543210',
      educationLevel: 'B.E. / B.Tech',
      studyArea: 'Computer Science & Engg',
      currentYear: '3rd Year',
      passingYear: '2026',
      isLoggedIn: true
    };

    onLogin(existingUser);
    setSuccessMsg('Logged In Successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-1">
            <GraduationCap className="w-6 h-6 text-emerald-300" />
            <h3 className="text-xl font-extrabold">
              {user ? 'My Student Profile' : (mode === 'register' ? 'Create Free Student Account' : 'Student Login')}
            </h3>
          </div>
          <p className="text-xs text-indigo-100">
            For 10th, 12th, Diploma, B.Tech, and Degree Students across India.
          </p>
        </div>

        {/* User Already Logged In View */}
        {user ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName}</h4>
                <p className="text-slate-500">{user.email} | {user.phone}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                  🎓 {user.educationLevel} ({user.studyArea})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Current Status / Year</span>
                <span className="font-bold text-slate-900 dark:text-white">{user.currentYear}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Passing Year</span>
                <span className="font-bold text-slate-900 dark:text-white">{user.passingYear}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 transition-colors"
            >
              Log Out of Account
            </button>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* Mode Switcher Pills */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-5">
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register (Free)
              </button>
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
            </div>

            {successMsg ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{successMsg}</h4>
              </div>
            ) : mode === 'register' ? (
              
              /* Registration Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manoj Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email ID *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="student@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile / WhatsApp No.</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Education Qualification (Supports 10th, 12th, Diploma, ITI, Degree, BTech) */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Highest Education Standard / Level *
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="10th Pass">10th Class Pass (SSC / Secondary)</option>
                    <option value="12th Pass">12th Class Pass (Inter / Higher Secondary)</option>
                    <option value="Diploma / ITI">Diploma / ITI Polytechnic</option>
                    <option value="B.E. / B.Tech">B.E. / B.Tech (Engineering)</option>
                    <option value="Degree (B.Sc/B.Com/B.A)">Degree (B.Sc / B.Com / B.A / BCA)</option>
                    <option value="Post Graduate">Post Graduate (M.Tech / M.Sc / MCA / MBA)</option>
                  </select>
                </div>

                {/* Study Area & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch / Study Stream</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science, MPC, ECE, General"
                      value={formData.studyArea}
                      onChange={(e) => setFormData({ ...formData, studyArea: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Year / Status</label>
                    <select
                      value={formData.currentYear}
                      onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="Studying">Currently Studying</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Passed Out">Passed Out / Job Seeker</option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Create Account & View Matched Jobs
                </button>

              </form>

            ) : (
              
              /* Sign In Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs py-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Sign In To Student Portal
                </button>
              </form>

            )}

          </div>
        )}

      </div>
    </div>
  );
}
