import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, Search, Clock, CheckCircle, AlertTriangle,
  Edit3, Camera, Award, TrendingUp, Activity, Globe
} from 'lucide-react';
import { mockUser, mockScanHistory, mockStats } from '../data/mockData';
import toast from 'react-hot-toast';

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: mockUser.name, email: mockUser.email, role: mockUser.role });

  const save = () => {
    setEditing(false);
    toast.success('Profile updated successfully');
  };

  const recent = mockScanHistory.slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and view activity</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-lg">
              {form.name.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-400 transition-colors">
              <Camera size={14} className="text-white" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-cyber py-2 text-lg font-bold"
                  placeholder="Full Name"
                />
                <input
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-cyber py-2 text-sm"
                  placeholder="Email"
                />
                <input
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="input-cyber py-2 text-sm"
                  placeholder="Role"
                />
                <div className="flex gap-2">
                  <button onClick={save} className="btn-primary text-sm py-2 px-4">Save Changes</button>
                  <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-white text-2xl font-black">{form.name}</h2>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                    {mockUser.plan}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-1">{form.email}</p>
                <p className="text-slate-500 text-sm mb-4">{form.role} · Member since {new Date(mockUser.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4">
                  <Edit3 size={14} /> Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Usage */}
          <div className="glass p-4 rounded-xl min-w-44 border border-slate-700/30">
            <p className="text-slate-400 text-xs mb-2">Monthly Usage</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-white text-2xl font-black">{mockUser.scansUsed.toLocaleString()}</span>
              <span className="text-slate-500 text-sm mb-0.5">/ {mockUser.scansLimit.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{ width: `${(mockUser.scansUsed / mockUser.scansLimit) * 100}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs">{((mockUser.scansUsed / mockUser.scansLimit) * 100).toFixed(1)}% used</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Scans', value: '2,847', icon: Search, color: '#3B82F6' },
          { label: 'Threats Found', value: '314', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Safe URLs', value: '2,423', icon: CheckCircle, color: '#22C55E' },
          { label: 'Reports Saved', value: '48', icon: Award, color: '#F59E0B' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="glass-card p-4"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${s.color}15` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="text-white text-xl font-black mb-0.5">{s.value}</div>
            <div className="text-slate-400 text-xs">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recent.map((scan, i) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-700/30 hover:border-slate-600/40 transition-all"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                scan.status === 'safe' ? 'bg-green-500/15' : scan.status === 'phishing' ? 'bg-red-500/15' : 'bg-yellow-500/15'
              }`}>
                {scan.status === 'safe' ? <CheckCircle size={16} className="text-green-400" /> :
                 scan.status === 'phishing' ? <AlertTriangle size={16} className="text-red-400" /> :
                 <AlertTriangle size={16} className="text-yellow-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm font-mono truncate">{scan.domain}</p>
                <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                  <Globe size={10} /> {scan.country} · Risk: {scan.riskScore} · {new Date(scan.timestamp).toLocaleDateString()}
                </p>
              </div>
              <span className={`badge-${scan.status} flex-shrink-0`}>
                {scan.status}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <Award size={16} className="text-yellow-400" />
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'First Scan', desc: 'Completed first URL scan', unlocked: true, icon: '🔍' },
            { title: 'Threat Hunter', desc: '100+ threats detected', unlocked: true, icon: '🛡️' },
            { title: 'Power Scanner', desc: '1000+ scans completed', unlocked: true, icon: '⚡' },
            { title: 'Elite Analyst', desc: '5000+ scans completed', unlocked: false, icon: '🎯' },
          ].map((b, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-yellow-500/8 border-yellow-500/25 hover:border-yellow-500/40'
                  : 'bg-slate-800/30 border-slate-700/30 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{b.icon}</div>
              <p className={`text-sm font-bold mb-1 ${b.unlocked ? 'text-yellow-400' : 'text-slate-500'}`}>{b.title}</p>
              <p className="text-slate-500 text-xs">{b.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
