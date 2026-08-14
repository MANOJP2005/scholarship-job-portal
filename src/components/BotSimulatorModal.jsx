import React, { useState } from 'react';
import { X, Send, MessageCircle, Bell, Check, ExternalLink, Settings, Bot } from 'lucide-react';

export default function BotSimulatorModal({ 
  isOpen, 
  onClose, 
  telegramLink, 
  whatsappLink, 
  onUpdateLinks 
}) {
  const [tgInput, setTgInput] = useState(telegramLink || 'https://t.me/student_opportunities');
  const [waInput, setWaInput] = useState(whatsappLink || 'https://whatsapp.com/channel/student_job_alerts');
  const [saved, setSaved] = useState(false);
  const [simulatedAlertSent, setSimulatedAlertSent] = useState(false);

  if (!isOpen) return null;

  const handleSaveLinks = (e) => {
    e.preventDefault();
    onUpdateLinks(tgInput, waInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const triggerTestBotNotification = () => {
    setSimulatedAlertSent(true);
    setTimeout(() => setSimulatedAlertSent(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-1">
            <Bot className="w-6 h-6 text-emerald-300" />
            <h3 className="text-xl font-extrabold">WhatsApp & Telegram Bot Engine</h3>
          </div>
          <p className="text-xs text-sky-100">
            Configure your custom WhatsApp Channel & Telegram links for daily automated job posts.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Bot Live Test Simulator */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-xs">Bot Status: ACTIVE</span>
              </div>
              <button
                onClick={triggerTestBotNotification}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px]"
              >
                ⚡ Trigger Test Push Alert
              </button>
            </div>

            {simulatedAlertSent && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-[11px] animate-fadeIn space-y-1">
                <div className="font-bold flex items-center">
                  <Bell className="w-3.5 h-3.5 mr-1" /> [BOT ALERT] Sent to WhatsApp & Telegram!
                </div>
                <div>"🔥 RRB NTPC Railway 11,558 Posts application closes in 3 Days! Apply now at: https://indianrailways.gov.in"</div>
              </div>
            )}
          </div>

          {/* Links Configuration Form */}
          <form onSubmit={handleSaveLinks} className="space-y-4">
            
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center">
              <Settings className="w-4 h-4 mr-1 text-indigo-500" /> Configure Your Official Channel Links
            </h4>

            {/* Telegram Channel Link */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                <Send className="w-3.5 h-3.5 text-sky-500 mr-1" /> Your Official Telegram Channel Link
              </label>
              <input
                type="url"
                required
                placeholder="https://t.me/your_channel_name"
                value={tgInput}
                onChange={(e) => setTgInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
              />
            </div>

            {/* WhatsApp Group / Channel Link */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 mr-1" /> Your Official WhatsApp Group / Channel Link
              </label>
              <input
                type="url"
                required
                placeholder="https://whatsapp.com/channel/your_channel_code"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="text-emerald-600 font-bold text-xs flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Links Updated Live!
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
              >
                Save Channel Links
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
