import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, AlertTriangle, Ban, Search, ChevronDown,
  Plus, Trash2, BarChart2, Globe, Activity, CheckCircle,
  XCircle, Settings, Database, Server
} from 'lucide-react';
import { mockUsers, blacklistedDomains, mockStats } from '../data/mockData';
import toast from 'react-hot-toast';

const tabConfig = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'blacklist', label: 'Blacklisted URLs', icon: Ban },
  { id: 'system', label: 'System Stats', icon: Activity },
];

export default function Admin() {
  const [tab, setTab] = useState('users');
  const [userQuery, setUserQuery] = useState('');
  const [blacklist, setBlacklist] = useState(blacklistedDomains);
  const [newDomain, setNewDomain] = useState('');

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  const addToBlacklist = () => {
    if (!newDomain.trim()) return;
    setBlacklist(b => [{
      domain: newDomain,
      addedDate: new Date().toISOString().split('T')[0],
      category: 'Manual Entry',
      reporter: 'Admin',
    }, ...b]);
    setNewDomain('');
    toast.success(`${newDomain} added to blacklist`);
  };

  const removeFromBlacklist = (domain) => {
    setBlacklist(b => b.filter(d => d.domain !== domain));
    toast.success(`${domain} removed from blacklist`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Admin Panel</h1>
        <p className="text-slate-400 text-sm mt-1">System administration and threat management</p>
      </motion.div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '50,240', icon: Users, color: '#3B82F6', change: '+12%' },
          { label: 'Active Threats', value: '47', icon: AlertTriangle, color: '#EF4444', change: '-3%' },
          { label: 'Blacklisted Domains', value: blacklist.length.toString(), icon: Ban, color: '#F59E0B', change: '+2' },
          { label: 'System Uptime', value: '99.99%', icon: Server, color: '#22C55E', change: 'SLA OK' },
        ].map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}15` }}>
                <c.icon size={18} style={{ color: c.color }} />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-700/50 text-slate-400">{c.change}</span>
            </div>
            <div className="text-2xl font-black text-white mb-0.5">{c.value}</div>
            <div className="text-slate-400 text-xs">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2"
      >
        {tabConfig.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'glass text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* User Management */}
        {tab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700/30 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={userQuery}
                  onChange={e => setUserQuery(e.target.value)}
                  placeholder="Search users..."
                  className="input-cyber pl-9 py-2 text-sm"
                />
              </div>
              <button className="btn-primary text-xs py-2 px-4">
                <Plus size={14} /> Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-cyber">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Plan</th>
                    <th>Scans</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-slate-200 text-sm font-medium">{user.name}</p>
                            <p className="text-slate-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-300'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                          user.plan === 'Enterprise' ? 'bg-blue-500/20 text-blue-400' :
                          user.plan === 'Pro' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td><span className="text-slate-300 text-sm font-medium">{user.scans.toLocaleString()}</span></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                          <span className={`text-xs ${user.status === 'active' ? 'text-green-400' : 'text-slate-500'}`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all">
                            <Settings size={13} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Blacklist */}
        {tab === 'blacklist' && (
          <motion.div
            key="blacklist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="glass-card p-4 flex gap-3">
              <input
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addToBlacklist()}
                placeholder="Enter domain to blacklist (e.g. evil-phish.tk)"
                className="input-cyber flex-1 py-2.5 font-mono text-sm"
              />
              <button onClick={addToBlacklist} className="btn-danger text-sm py-2.5 px-5">
                <Ban size={14} /> Blacklist
              </button>
            </div>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-cyber">
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Category</th>
                      <th>Added Date</th>
                      <th>Reporter</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blacklist.map((item, i) => (
                      <motion.tr
                        key={item.domain}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            <Ban size={12} className="text-red-400" />
                            <span className="text-red-400 font-mono text-xs">{item.domain}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20">
                            {item.category}
                          </span>
                        </td>
                        <td><span className="text-slate-400 text-xs">{item.addedDate}</span></td>
                        <td>
                          <span className={`text-xs font-medium ${item.reporter === 'AI Engine' ? 'text-blue-400' : 'text-slate-300'}`}>
                            {item.reporter}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => removeFromBlacklist(item.domain)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* System Stats */}
        {tab === 'system' && (
          <motion.div
            key="system"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* System Health */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Server size={16} className="text-green-400" /> System Health
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'API Gateway', status: 'Operational', uptime: '99.99%', color: '#22C55E' },
                  { label: 'AI Inference Engine', status: 'Operational', uptime: '99.97%', color: '#22C55E' },
                  { label: 'Threat Intel DB', status: 'Operational', uptime: '100%', color: '#22C55E' },
                  { label: 'ML Pipeline', status: 'Operational', uptime: '99.95%', color: '#22C55E' },
                  { label: 'Notification Service', status: 'Degraded', uptime: '97.2%', color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.color }} />
                      <span className="text-slate-300 text-sm">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">{s.uptime}</span>
                      <span className="text-xs font-medium" style={{ color: s.color }}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scan Statistics */}
            <div className="glass-card p-6">
              <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-400" /> Platform Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Scans', value: mockStats.totalScans.toLocaleString(), color: '#3B82F6' },
                  { label: 'Threats Blocked', value: mockStats.threatsDetected.toLocaleString(), color: '#EF4444' },
                  { label: 'Accuracy', value: `${mockStats.accuracy}%`, color: '#22C55E' },
                  { label: 'Avg Response', value: `${mockStats.avgScanTime}s`, color: '#F59E0B' },
                  { label: 'Daily API Calls', value: '2.4M', color: '#8B5CF6' },
                  { label: 'Data Processed', value: '840 GB', color: '#06B6D4' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/30">
                    <div className="text-lg font-black mb-0.5" style={{ color: item.color }}>{item.value}</div>
                    <div className="text-slate-500 text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
