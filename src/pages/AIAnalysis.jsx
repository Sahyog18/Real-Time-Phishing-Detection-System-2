import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, ShieldAlert, AlertTriangle, TrendingUp,
  Target, Zap, Eye, Lock, Globe, CheckCircle, Info
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { aiThreatFactors, securityRecommendations } from '../data/mockData';

const radarData = [
  { factor: 'Domain Spoof', score: 92 },
  { factor: 'SSL Invalid', score: 85 },
  { factor: 'Domain Age', score: 80 },
  { factor: 'Suspicious TLD', score: 72 },
  { factor: 'Redirect Chain', score: 65 },
  { factor: 'IP Blacklist', score: 98 },
];

const severityConfig = {
  critical: { color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Critical' },
  high: { color: '#F59E0B', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'High' },
  medium: { color: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/30', label: 'Medium' },
  low: { color: '#22C55E', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'Low' },
};

export default function AIAnalysis() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
            <Brain size={20} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-black text-white">AI Threat Analysis</h1>
        </div>
        <p className="text-slate-400 text-sm ml-14">Deep learning model explainability report · Model v3.2.1</p>
      </motion.div>

      {/* AI Confidence Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 border border-red-500/30 bg-red-500/5"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <ShieldAlert size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">HIGH-RISK PHISHING DETECTED</h2>
              <p className="text-slate-400 text-sm mt-0.5">The AI model has flagged this URL with 97% confidence as a phishing attempt targeting PayPal credentials.</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="text-center">
              <div className="text-4xl font-black text-red-400">97%</div>
              <div className="text-slate-500 text-xs">AI Confidence</div>
            </div>
          </div>
        </div>
        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '97%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-400" />
            Threat Factor Breakdown
          </h2>
          <div className="space-y-4">
            {aiThreatFactors.map((f, i) => {
              const sc = severityConfig[f.severity];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className={`p-4 rounded-xl ${sc.bg} border ${sc.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: sc.color }} />
                      <div>
                        <p className="text-slate-200 text-sm font-semibold">{f.factor}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{f.description}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold ml-2 flex-shrink-0" style={{ color: sc.color, background: `${sc.color}15` }}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.score}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: sc.color }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{ color: sc.color }}>{f.score}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-6"
          >
            <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Target size={16} className="text-blue-400" />
              Risk Vector Analysis
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(51,65,85,0.5)" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#64748B', fontSize: 11 }} />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#F1F5F9', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Why Flagged */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Eye size={16} className="text-violet-400" />
              Why Was This Flagged?
            </h2>
            <div className="space-y-3">
              {[
                { icon: Globe, text: 'Domain name mimics "paypal" using a free TLD (.tk) — a common phishing tactic.', color: '#EF4444' },
                { icon: Lock, text: 'No valid SSL certificate found. Legitimate PayPal always uses HTTPS.', color: '#F59E0B' },
                { icon: Zap, text: 'Domain was registered 3 days ago — phishing sites are often newly created.', color: '#F59E0B' },
                { icon: Target, text: 'IP address (185.220.101.47) found on 12 global threat intelligence blacklists.', color: '#EF4444' },
                { icon: TrendingUp, text: 'URL pattern matches 94% of known PayPal credential harvest templates.', color: '#EF4444' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                    <item.icon size={14} style={{ color: item.color }} />
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-400" />
          Security Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityRecommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/30"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 text-[10px] font-bold">{i + 1}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{rec}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <Info size={16} className="text-blue-400" />
          AI Model Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Model Version', value: 'PhishAI v3.2.1' },
            { label: 'Training Samples', value: '14.2M URLs' },
            { label: 'Algorithm', value: 'Ensemble XGBoost + BERT' },
            { label: 'Last Updated', value: 'Jun 10, 2025' },
            { label: 'Feature Count', value: '127 features' },
            { label: 'Inference Time', value: '280ms avg' },
            { label: 'F1 Score', value: '0.9923' },
            { label: 'False Positive Rate', value: '0.8%' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/30">
              <p className="text-slate-500 text-xs mb-1">{item.label}</p>
              <p className="text-slate-200 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
