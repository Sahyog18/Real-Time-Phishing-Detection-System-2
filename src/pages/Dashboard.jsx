import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  Shield, Search, AlertTriangle, CheckCircle, TrendingUp,
  TrendingDown, Activity, Globe, Zap, Eye, Clock
} from 'lucide-react';
import {
  mockStats, weeklyTrendData, monthlyTrendData,
  pieChartData, mockScanHistory, threatTypeData
} from '../data/mockData';

function StatCard({ label, value, icon: Icon, color, change, suffix = '' }) {
  const [displayVal, setDisplayVal] = useState(0);
  const numericVal = parseFloat(String(value).replace(/[^0-9.]/g, ''));

  useEffect(() => {
    let start = 0;
    const increment = numericVal / 60;
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericVal) {
        setDisplayVal(numericVal);
        clearInterval(timer);
      } else {
        setDisplayVal(Math.floor(start));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [numericVal]);

  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass-card p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2" style={{ background: color }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-white mb-1">
        {typeof value === 'string' && value.includes('K') ? `${Math.floor(displayVal / 1000)}K+` : 
         typeof value === 'string' && value.includes('%') ? `${displayVal}%` : 
         displayVal.toLocaleString()}{suffix}
      </div>
      <p className="text-slate-400 text-sm">{label}</p>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="text-slate-300 font-semibold mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="text-white font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const recent = mockScanHistory.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white">Security Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time threat intelligence and analytics overview</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Scans" value={mockStats.totalScans} icon={Search} color="#3B82F6" change={12} />
        <StatCard label="Safe URLs" value={mockStats.safeUrls} icon={CheckCircle} color="#22C55E" change={8} />
        <StatCard label="Threats Detected" value={mockStats.threatsDetected} icon={AlertTriangle} color="#EF4444" change={-3} />
        <StatCard label="Risky Domains" value={mockStats.riskyDomains} icon={Globe} color="#F59E0B" change={5} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-bold text-base">Weekly Threat Trends</h2>
              <p className="text-slate-500 text-xs mt-0.5">Daily scan results breakdown</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              {[
                { label: 'Safe', color: '#22C55E' },
                { label: 'Suspicious', color: '#F59E0B' },
                { label: 'Phishing', color: '#EF4444' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                  <span className="text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrendData}>
              <defs>
                <linearGradient id="safe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="phishing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="suspicious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.4)" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="safe" stroke="#22C55E" strokeWidth={2} fill="url(#safe)" name="Safe" />
              <Area type="monotone" dataKey="suspicious" stroke="#F59E0B" strokeWidth={2} fill="url(#suspicious)" name="Suspicious" />
              <Area type="monotone" dataKey="phishing" stroke="#EF4444" strokeWidth={2} fill="url(#phishing)" name="Phishing" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-white font-bold text-base mb-1">Scan Distribution</h2>
          <p className="text-slate-500 text-xs mb-4">Results breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieChartData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
                  <span className="text-slate-400 text-xs">{d.name}</span>
                </div>
                <span className="text-white text-xs font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Threat Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6"
        >
          <h2 className="text-white font-bold text-base mb-1">Monthly Analysis</h2>
          <p className="text-slate-500 text-xs mb-4">Threats vs total scans</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.4)" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="scans" fill="rgba(59,130,246,0.3)" stroke="#3B82F6" strokeWidth={1} radius={[4,4,0,0]} name="Total Scans" />
              <Bar dataKey="threats" fill="rgba(239,68,68,0.4)" stroke="#EF4444" strokeWidth={1} radius={[4,4,0,0]} name="Threats" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Threat Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-white font-bold text-base mb-1">Threat Categories</h2>
          <p className="text-slate-500 text-xs mb-4">By attack type distribution</p>
          <div className="space-y-4">
            {threatTypeData.map((t, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-xs font-medium">{t.type}</span>
                  <span className="text-slate-400 text-xs">{t.count} threats · {t.percent}%</span>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${t.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${['#EF4444','#F59E0B','#3B82F6','#8B5CF6','#06B6D4'][i]}, ${['#dc2626','#d97706','#2563eb','#7c3aed','#0891b2'][i]})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Scans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-base">Recent Scans</h2>
            <p className="text-slate-500 text-xs mt-0.5">Latest URL analysis activity</p>
          </div>
          <a href="/history" className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1">
            View all <Eye size={14} />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-cyber">
            <thead>
              <tr>
                <th>URL</th>
                <th>Status</th>
                <th>Risk Score</th>
                <th>SSL</th>
                <th>Domain Age</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((scan, i) => (
                <motion.tr
                  key={scan.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                >
                  <td>
                    <span className="text-blue-400 font-mono text-xs">{scan.domain}</span>
                  </td>
                  <td>
                    <span className={`badge-${scan.status}`}>
                      {scan.status === 'safe' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                      {scan.status}
                    </span>
                  </td>
                  <td>
                    <span className={`font-bold text-sm ${scan.riskScore >= 70 ? 'text-red-400' : scan.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {scan.riskScore}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs font-medium ${scan.ssl ? 'text-green-400' : 'text-red-400'}`}>
                      {scan.ssl ? '✓ Valid' : '✗ Missing'}
                    </span>
                  </td>
                  <td><span className="text-slate-400 text-xs">{scan.domainAge}</span></td>
                  <td>
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(scan.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Scan Time', value: '1.4s', icon: Zap, color: '#3B82F6' },
          { label: 'AI Accuracy', value: '99.2%', icon: Activity, color: '#22C55E' },
          { label: 'Threats Today', value: '47', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Blacklisted Domains', value: '1,240', icon: Shield, color: '#F59E0B' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.07 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
              <item.icon size={18} style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">{item.value}</p>
              <p className="text-slate-400 text-xs">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
