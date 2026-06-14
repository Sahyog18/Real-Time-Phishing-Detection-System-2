import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Moon, Sun, Bell, Shield, User, Palette, Globe,
  Lock, Mail, Smartphone, ChevronRight, CheckCircle, Save
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { mockUser } from '../data/mockData';
import toast from 'react-hot-toast';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-blue-500' : 'bg-slate-600'}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </button>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const [notifs, setNotifs] = useState({
    emailAlerts: true, threatWarnings: true, weeklyReport: false, productUpdates: true,
  });
  const [privacy, setPrivacy] = useState({
    twoFactor: false, sessionTimeout: true, apiAccess: true,
  });

  const saveSettings = () => toast.success('Settings saved successfully!');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your PhishGuard AI preferences</p>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-6">
        <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
          <Palette size={16} className="text-violet-400" />
          Appearance
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => !isDark && toggleTheme()}
            className={`p-4 rounded-xl border-2 transition-all text-left ${isDark ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700/50 hover:border-slate-600'}`}
          >
            <div className="w-full h-16 rounded-lg bg-slate-950 border border-slate-700/50 mb-3 flex items-center justify-center">
              <Moon size={20} className="text-blue-400" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm font-semibold">Dark Mode</p>
                <p className="text-slate-500 text-xs">Cybersecurity theme</p>
              </div>
              {isDark && <CheckCircle size={16} className="text-blue-400" />}
            </div>
          </button>
          <button
            onClick={() => isDark && toggleTheme()}
            className={`p-4 rounded-xl border-2 transition-all text-left ${!isDark ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700/50 hover:border-slate-600'}`}
          >
            <div className="w-full h-16 rounded-lg bg-slate-100 border border-slate-200 mb-3 flex items-center justify-center">
              <Sun size={20} className="text-yellow-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-200 text-sm font-semibold">Light Mode</p>
                <p className="text-slate-500 text-xs">Clean bright theme</p>
              </div>
              {!isDark && <CheckCircle size={16} className="text-blue-400" />}
            </div>
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
          <Bell size={16} className="text-blue-400" />
          Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Security Alerts', desc: 'Receive alerts when threats are detected', icon: Mail },
            { key: 'threatWarnings', label: 'Real-time Threat Warnings', desc: 'Instant browser notifications for high-risk scans', icon: Shield },
            { key: 'weeklyReport', label: 'Weekly Security Report', desc: 'Summary of your scan activity every Monday', icon: Globe },
            { key: 'productUpdates', label: 'Product Updates', desc: 'News about new features and AI model updates', icon: Bell },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{item.label}</p>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={notifs[item.key]}
                  onChange={v => setNotifs(n => ({ ...n, [item.key]: v }))}
                />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
        <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
          <Lock size={16} className="text-green-400" />
          Security Settings
        </h2>
        <div className="space-y-4">
          {[
            { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', icon: Smartphone, badge: 'Recommended' },
            { key: 'sessionTimeout', label: 'Auto Session Timeout', desc: 'Automatically sign out after 30 minutes of inactivity', icon: Lock, badge: null },
            { key: 'apiAccess', label: 'API Access', desc: 'Allow third-party applications to access your scan data', icon: Globe, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-200 text-sm font-medium">{item.label}</p>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-semibold">{item.badge}</span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs">{item.desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={privacy[item.key]}
                  onChange={v => setPrivacy(n => ({ ...n, [item.key]: v }))}
                />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
          <User size={16} className="text-slate-400" />
          Account
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Change Password', desc: 'Update your account password', arrow: true },
            { label: 'Download My Data', desc: 'Export all your scan data and history', arrow: true },
            { label: 'Connected Apps', desc: 'Manage third-party app integrations', arrow: true },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/30"
            >
              <div>
                <p className="text-slate-200 text-sm font-medium text-left">{item.label}</p>
                <p className="text-slate-500 text-xs text-left">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-slate-500" />
            </button>
          ))}
          <button className="w-full p-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-red-500/60 text-xs">Permanently delete your account and all data</p>
          </button>
        </div>
      </motion.div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <button onClick={saveSettings} className="btn-primary">
          <Save size={16} />
          Save All Settings
        </button>
      </motion.div>
    </div>
  );
}
