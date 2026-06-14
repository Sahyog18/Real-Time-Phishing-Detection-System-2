import React, { useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Download,
  Globe, Lock, Clock, Server, ArrowLeft, Brain, AlertCircle,
  ShieldAlert, Info, ExternalLink, RefreshCw, ChevronRight
} from 'lucide-react';
import { aiThreatFactors, securityRecommendations } from '../data/mockData';

function getRiskProfile(url) {
  const u = (url || '').toLowerCase();
  const phishingIndicators = [
    'paypal', 'amazon', 'netflix', 'banking', 'secure', 'verify',
    'account', 'login', 'update', 'crypto', 'reward', 'claim'
  ];
  const safeDomains = ['google.com', 'github.com', 'microsoft.com', 'apple.com', 'dropbox.com'];
  
  if (safeDomains.some(d => u.includes(d))) {
    return {
      status: 'safe', score: Math.floor(Math.random() * 5) + 1,
      ssl: true, domainAge: '15+ years', country: 'US',
      ip: '142.250.80.46', registrar: 'MarkMonitor Inc.',
      category: 'Legitimate Website'
    };
  }
  
  const isSuspicious = u.includes('bit.ly') || u.includes('tinyurl') || u.includes('t.co');
  if (isSuspicious) {
    return {
      status: 'suspicious', score: Math.floor(Math.random() * 30) + 50,
      ssl: true, domainAge: '10+ years', country: 'US',
      ip: '67.199.248.11', registrar: 'GoDaddy',
      category: 'URL Shortener'
    };
  }
  
  const isPhishing = phishingIndicators.some(i => u.includes(i));
  return {
    status: isPhishing ? 'phishing' : 'suspicious',
    score: isPhishing ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 30) + 50,
    ssl: !isPhishing,
    domainAge: isPhishing ? '2 days' : '6 months',
    country: isPhishing ? 'RU' : 'US',
    ip: isPhishing ? '185.220.101.47' : '104.21.45.67',
    registrar: isPhishing ? 'Freenom' : 'Namecheap',
    category: isPhishing ? 'Credential Harvesting' : 'Suspicious Redirect'
  };
}

function RiskGauge({ score, status }) {
  const color = status === 'safe' ? '#22C55E' : status === 'suspicious' ? '#F59E0B' : '#EF4444';
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-black"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-slate-400 text-xs">Risk Score</span>
      </div>
    </div>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.state?.url || 'https://example.com';
  const result = useMemo(() => getRiskProfile(url), [url]);

  const statusConfig = {
    safe: { icon: CheckCircle, color: '#22C55E', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'SAFE', label: 'This URL appears to be safe', badge: 'badge-safe' },
    suspicious: { icon: AlertTriangle, color: '#F59E0B', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'SUSPICIOUS', label: 'Exercise caution with this URL', badge: 'badge-suspicious' },
    phishing: { icon: XCircle, color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'PHISHING DETECTED', label: 'This URL is a phishing attempt', badge: 'badge-phishing' },
  };
  const cfg = statusConfig[result.status];
  const StatusIcon = cfg.icon;

  const severityColor = { critical: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#22C55E' };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/scanner')} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">Scan Results</h1>
            <p className="text-slate-400 text-sm">Analysis completed in 1.4s</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/scanner')} className="btn-secondary text-sm py-2 px-4">
            <RefreshCw size={14} /> Scan Again
          </button>
          <button className="btn-primary text-sm py-2 px-4">
            <Download size={14} /> Download Report
          </button>
        </div>
      </motion.div>

      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`glass-card p-8 border ${cfg.border} relative overflow-hidden`}
      >
        <div className={`absolute inset-0 ${cfg.bg} opacity-30`} />
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Gauge */}
          <div className="flex flex-col items-center gap-4">
            <RiskGauge score={result.score} status={result.status} />
            <div className={`px-4 py-2 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center gap-2`}>
              <StatusIcon size={16} style={{ color: cfg.color }} />
              <span className="font-bold text-sm" style={{ color: cfg.color }}>{cfg.text}</span>
            </div>
          </div>

          {/* URL & Domain Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Scanned URL</p>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
                <Globe size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200 text-sm font-mono break-all">{url}</span>
                <a href="#" className="ml-auto flex-shrink-0 text-blue-400 hover:text-blue-300">
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <p className="text-slate-300 text-sm">{cfg.label}. Our AI analyzed 50+ security indicators in real time.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'SSL/HTTPS', value: result.ssl ? 'Valid' : 'Missing', icon: Lock, ok: result.ssl },
                { label: 'Domain Age', value: result.domainAge, icon: Clock, ok: !result.domainAge.includes('day') },
                { label: 'Country', value: result.country, icon: Globe, ok: result.country === 'US' },
                { label: 'Category', value: result.category, icon: Shield, ok: result.status === 'safe' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon size={12} className={item.ok ? 'text-green-400' : 'text-red-400'} />
                    <span className="text-slate-500 text-xs">{item.label}</span>
                  </div>
                  <p className={`text-sm font-semibold ${item.ok ? 'text-green-400' : 'text-red-400'}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Threat Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-400" />
            Threat Indicators
          </h2>
          <div className="space-y-3">
            {aiThreatFactors.slice(0, result.status === 'safe' ? 1 : result.status === 'suspicious' ? 3 : 6).map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-200 text-sm font-medium">{f.factor}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        color: severityColor[f.severity],
                        background: `${severityColor[f.severity]}15`,
                        border: `1px solid ${severityColor[f.severity]}30`
                      }}
                    >
                      {f.severity}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs">{f.description}</p>
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.status === 'safe' ? 5 : f.score}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: severityColor[f.severity] }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Brain size={18} className="text-blue-400" />
            AI Recommendations
          </h2>
          <div className="space-y-3">
            {securityRecommendations.slice(0, result.status === 'safe' ? 3 : 6).map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-[10px] font-bold">{i + 1}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
              </motion.div>
            ))}
          </div>

          {/* AI Confidence */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">AI Confidence Score</span>
              <span className="text-blue-400 font-bold text-sm">
                {result.status === 'safe' ? 99 : result.status === 'suspicious' ? 78 : 97}%
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: result.status === 'safe' ? '99%' : result.status === 'suspicious' ? '78%' : '97%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domain Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Globe size={18} className="text-slate-400" />
          Domain Intelligence
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'IP Address', value: result.ip },
            { label: 'Domain Age', value: result.domainAge },
            { label: 'Country', value: result.country },
            { label: 'Registrar', value: result.registrar },
            { label: 'SSL Status', value: result.ssl ? 'Valid Certificate' : 'No Certificate' },
            { label: 'Redirects', value: result.status === 'safe' ? '0' : '3 detected' },
            { label: 'Blacklisted', value: result.status === 'phishing' ? 'Yes — 12 lists' : 'No' },
            { label: 'Response Code', value: result.status === 'safe' ? '200 OK' : '301 Redirect' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/30">
              <p className="text-slate-500 text-xs mb-1">{item.label}</p>
              <p className="text-slate-200 text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap gap-3 justify-end"
      >
        <Link to="/ai-analysis">
          <button className="btn-secondary text-sm py-2.5 px-5">
            <Brain size={14} />
            Full AI Analysis
            <ChevronRight size={14} />
          </button>
        </Link>
        <button className="btn-secondary text-sm py-2.5 px-5">
          <AlertCircle size={14} />
          Report False Positive
        </button>
        <button className="btn-primary text-sm py-2.5 px-5">
          <Download size={14} />
          Download PDF Report
        </button>
      </motion.div>
    </div>
  );
}
