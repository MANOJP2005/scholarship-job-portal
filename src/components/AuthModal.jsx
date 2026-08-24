import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, User, Mail, Phone, GraduationCap, AlertTriangle, Eye, EyeOff, Lock, Bookmark, Trash2, Calendar } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function AuthModal({ isOpen, onClose, user, onLogin, onRegister, onLogout, bookmarkedItems = [], onToggleBookmark, onSelectItem }) {
  const [mode, setMode] = useState('register'); // 'login' | 'register'
  
  useEffect(() => {
    if (isOpen && !user) {
      setMode('login');
    }
  }, [isOpen, user]);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Registration State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    educationLevel: 'B.E. / B.Tech',
    studyArea: 'Computer Science & Engineering',
    currentYear: '3rd Year',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Save a new user to the registered users list
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) return;

    if (!isSupabaseConfigured()) {
      setLoginError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (formData.password.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: {
        fullName: formData.fullName,
        phone: formData.phone,
        educationLevel: formData.educationLevel,
        studyArea: formData.studyArea,
        currentYear: formData.currentYear,
      } },
    });

    if (error) {
      setLoginError(error.message);
      return;
    }

    const newUserProfile = {
      id: data.user.id,
      email: data.user.email,
      ...data.user.user_metadata,
      isLoggedIn: Boolean(data.session),
      createdAt: data.user.created_at,
    };

    if (data.session) {
      onRegister(newUserProfile);
      setSuccessMsg('Account Created Successfully! Welcome to VIDYASUDDHI.');
    } else {
      setSuccessMsg('Account created. Check your email to confirm your account, then sign in.');
      setMode('login');
      setLoginEmail(formData.email);
    }
    setLoginError('');
    setTimeout(() => {
      setSuccessMsg('');
      if (data.session) onClose();
    }, data.session ? 1500 : 2500);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    if (!isSupabaseConfigured()) {
      setLoginError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) {
      setLoginError(error.message);
      return;
    }

    onLogin({
      id: data.user.id,
      email: data.user.email,
      ...data.user.user_metadata,
      isLoggedIn: true,
      createdAt: data.user.created_at,
    });
    setLoginError('');
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
        <div className="p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-1">
            <GraduationCap className="w-6 h-6 text-amber-200" />
            <h3 className="text-xl font-extrabold">
              {user ? 'My Student Profile' : (mode === 'register' ? 'Create Free Student Account' : 'Sign In to VIDYASUDDHI')}
            </h3>
          </div>
          <p className="text-xs text-amber-100">
            For 10th, 12th, Diploma, B.Tech, and Degree Students across India.
          </p>
        </div>

        {/* User Already Logged In View */}
        {user ? (
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName}</h4>
                <p className="text-slate-500">{user.email} {user.phone ? `| ${user.phone}` : ''}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                  🎓 {user.educationLevel} ({user.studyArea})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Current Status / Year</span>
                <span className="font-bold text-slate-900 dark:text-white">{user.currentYear}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-2 mb-3">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">My Saved Opportunities</h4>
              </div>
              {bookmarkedItems.length === 0 ? (
                <p className="text-slate-500 text-center py-4 bg-slate-50 dark:bg-slate-800 rounded-xl">No saved opportunities yet.</p>
              ) : (
                <div className="space-y-2">
                  {bookmarkedItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                      <div className="flex-1 min-w-0 pr-3 cursor-pointer" onClick={() => onSelectItem && onSelectItem(item)}>
                        <h5 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.type === 'job' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                          }`}>
                            {item.type === 'job' ? 'JOB' : 'SCHOLARSHIP'}
                          </span>
                          <span className="flex items-center text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.deadline}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleBookmark && onToggleBookmark(item.id); }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200 transition-colors mt-4"
            >
              Log Out of Account
            </button>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* Mode Switcher Pills */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-5">
              <button
                onClick={() => { setMode('register'); setLoginError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register (Free)
              </button>
              <button
                onClick={() => { setMode('login'); setLoginError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

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

                {/* Password */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password * (Min 6 chars)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Education Level */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Highest Education Standard / Level *
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Diploma/ITI">Diploma/ITI</option>
                    <option value="B.E./B.Tech">B.E./B.Tech</option>
                    <option value="Degree">Degree</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>

                {/* Study Area & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch / Study Stream</label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Science, MPC, ECE"
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
                  className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-md shadow-amber-600/20"
                >
                  Create Account & View Matched Jobs
                </button>

              </form>

            ) : (
              
              /* Sign In Form */
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs py-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Registered Email ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="Enter the email you registered with"
                      value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                      className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md"
                >
                  Sign In To VIDYASUDDHI
                </button>

                <p className="text-center text-slate-500 text-[11px]">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => { setMode('register'); setLoginError(''); }} className="text-amber-600 font-bold hover:underline">
                    Register for Free
                  </button>
                </p>
              </form>

            )}

          </div>
        )}

      </div>
    </div>
  );
}
