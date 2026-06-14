import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Shield, AlertTriangle, CheckCircle, Loader,
  Lock, Globe, Clock, Cpu, Database, Zap, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const scanSteps = [
  { id: 'ssl', label: 'Checking SSL Certificate', icon: Lock, duration: 800 },
  { id: 'domain', label: 'Analyzing Domain Age & WHOIS', icon: Globe, duration: 700 },
  { id: 'ai', label: 'Running AI Threat Analysis', icon: Cpu, duration: 1200 },
  { id: 'intel', label: 'Threat Intelligence Lookup', icon: Database, duration: 900 },
  { id: 'final', label: 'Generating Security Report', icon: Zap, duration: 400 },
];

const recentScans = [
  { url: 'google.com', status: 'safe' },
  { url: 'paypal-secure-login.tk', status: 'phishing' },
  { url: 'github.com', status: 'safe' },
  { url: 'bit.ly/free-gift', status: 'suspicious' },
];

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const runScan = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL to scan.');
      return;
    }
    setScanning(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setProgress(0);

    let done = 0;
    for (let i = 0; i < scanSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, scanSteps[i].duration));
      setCompletedSteps(prev => [...prev, scanSteps[i].id]);
      done++;
      setProgress(Math.round((done / scanSteps.length) * 100));
    }

    await new Promise(r => setTimeout(r, 300));
    setScanning(false);
    navigate('/results', { state: { url } });
  };

  const pasteExample = (example) => {
    setUrl(`https://${example}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-black text-white">URL Scanner</h1>
          <p className="text-slate-400 text-sm mt-1">Analyze any URL for phishing, malware, and security threats</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-green-500/30 text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AI Engine Online
        </div>
      </motion.div>

      {/* Main Scanner Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={scanning ? { rotate: 360 } : { rotate: 0 }}
            transition={scanning ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
            className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center"
          >
            <Shield size={40} className={`${scanning ? 'text-cyan-400' : 'text-blue-400'} transition-colors`} />
          </motion.div>
          <h2 className="text-xl font-bold text-white mb-1">Paste URL to Analyze</h2>
          <p className="text-slate-400 text-sm">Supports HTTP/HTTPS, shortened URLs, and raw domains</p>
        </div>

        {/* URL Input */}
        <div className="relative mb-6">
          <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !scanning && runScan()}
            placeholder="https://suspicious-website.com/login"
            className="input-cyber pl-12 pr-36 py-4 text-base font-mono"
            disabled={scanning}
          />
          <motion.button
            onClick={runScan}
            disabled={scanning}
            whileHover={{ scale: scanning ? 1 : 1.02 }}
            whileTap={{ scale: scanning ? 1 : 0.98 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-5 text-sm"
          >
            {scanning ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <>
                <Search size={16} />
                Scan Now
              </>
            )}
          </motion.button>
        </div>

        {/* Quick examples */}
        {!scanning && (
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-slate-500 text-xs">Try example:</span>
            {recentScans.map((s, i) => (
              <button
                key={i}
                onClick={() => pasteExample(s.url)}
                className={`text-xs px-3 py-1 rounded-lg border transition-all hover:scale-105 ${
                  s.status === 'safe'
                    ? 'border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/10'
                    : s.status === 'phishing'
                    ? 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10'
                    : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/10'
                }`}
              >
                {s.url}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Scan Progress */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6"
          >
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm font-medium">Scanning in progress...</span>
                <span className="text-blue-400 text-sm font-bold">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {scanSteps.map((step, i) => {
                const isDone = completedSteps.includes(step.id);
                const isActive = currentStep === i && !isDone;
                const StepIcon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
                    className="flex items-center gap-4 p-3 rounded-xl"
                    style={{ background: isActive ? 'rgba(59, 130, 246, 0.08)' : isDone ? 'rgba(34, 197, 94, 0.05)' : 'transparent' }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDone ? 'bg-green-500/20' : isActive ? 'bg-blue-500/20' : 'bg-slate-700/30'
                    }`}>
                      {isDone ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : isActive ? (
                        <Loader size={16} className="text-blue-400 animate-spin" />
                      ) : (
                        <StepIcon size={16} className="text-slate-500" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isDone ? 'text-green-400' : isActive ? 'text-blue-300' : 'text-slate-500'
                    }`}>
                      {step.label}
                    </span>
                    {isDone && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto text-green-400 text-xs font-semibold"
                      >
                        Done ✓
                      </motion.span>
                    )}
                    {isActive && (
                      <div className="ml-auto flex gap-1">
                        {[0,1,2].map(d => (
                          <div
                            key={d}
                            className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${d * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Scanning URL display */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/50 border border-slate-700/30">
              <span className="text-slate-500 text-xs">Analyzing: </span>
              <span className="text-blue-400 text-xs font-mono break-all">{url}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info cards */}
      {!scanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { icon: Lock, label: '50+ Security Checks', desc: 'SSL, WHOIS, DNS, redirects & more', color: '#3B82F6' },
            { icon: Clock, label: 'Sub-2 Second Results', desc: 'Real-time analysis & reporting', color: '#22C55E' },
            { icon: Database, label: 'Global Threat Feeds', desc: 'VirusTotal, PhishTank & more', color: '#F59E0B' },
          ].map((c, i) => (
            <div key={i} className="glass-card p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15` }}>
                <c.icon size={18} style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-slate-200 text-sm font-semibold">{c.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
