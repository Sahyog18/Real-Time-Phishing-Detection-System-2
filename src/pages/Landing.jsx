import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Search, Zap, Lock, Globe, BarChart2,
  ArrowRight, ChevronRight, CheckCircle, AlertTriangle,
  Eye, Brain, Database, Users, TrendingUp, Award
} from 'lucide-react';

const stats = [
  { label: 'URLs Analyzed', value: '2.8M+', icon: Search, color: '#3B82F6' },
  { label: 'Threats Blocked', value: '340K+', icon: Shield, color: '#EF4444' },
  { label: 'Accuracy Rate', value: '99.2%', icon: Award, color: '#22C55E' },
  { label: 'Active Users', value: '50K+', icon: Users, color: '#F59E0B' },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning models trained on millions of phishing samples detect threats with 99.2% accuracy.',
    color: '#3B82F6',
  },
  {
    icon: Zap,
    title: 'Real-Time Detection',
    description: 'Scan URLs in under 1.4 seconds. Instant threat intelligence lookup across 50+ global blacklist databases.',
    color: '#F59E0B',
  },
  {
    icon: Lock,
    title: 'SSL & Domain Analysis',
    description: 'Deep inspection of SSL certificates, domain age, WHOIS data, DNS records, and redirect chains.',
    color: '#22C55E',
  },
  {
    icon: Globe,
    title: 'Global Threat Intelligence',
    description: 'Connected to worldwide threat feeds including VirusTotal, PhishTank, Google Safe Browsing, and more.',
    color: '#8B5CF6',
  },
  {
    icon: BarChart2,
    title: 'Advanced Analytics',
    description: 'Comprehensive dashboards with threat trends, historical data, risk scoring, and exportable reports.',
    color: '#EC4899',
  },
  {
    icon: Database,
    title: 'Threat Database',
    description: 'Continuously updated repository of known malicious domains, IPs, and phishing kits.',
    color: '#06B6D4',
  },
];

const threats = [
  { url: 'paypal-secure-login.tk', status: 'phishing', score: 97 },
  { url: 'amazon-account-verify.ml', status: 'phishing', score: 94 },
  { url: 'google.com', status: 'safe', score: 2 },
  { url: 'secure-banking.xyz', status: 'phishing', score: 99 },
  { url: 'github.com', status: 'safe', score: 1 },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    const increment = num / 60;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <Shield size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">PhishGuard <span className="text-blue-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#stats" className="text-slate-400 hover:text-white transition-colors text-sm">Stats</a>
            <a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
            <Link to="/signup">
              <button className="btn-primary text-sm py-2 px-4">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center cyber-grid pt-16">
        {/* Animated bg orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 text-blue-400 text-sm font-medium mb-8"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI Model v3.2 — 99.2% Detection Accuracy
          </motion.div>

          {/* Shield Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative inline-block mb-8 float"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl scale-150" />
              <div className="relative w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl neon-blue">
                <Shield size={56} className="text-white" />
              </div>
              {/* Ripple rings */}
              {[1,2,3].map(i => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border border-blue-500/20 animate-ripple"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            <span className="text-white">Real-Time AI Powered</span>
            <br />
            <span className="gradient-text">Phishing Detection</span>
            <br />
            <span className="text-white text-4xl md:text-5xl font-bold">& Prevention</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Protect your organization with enterprise-grade AI that analyzes URLs in real time,
            detects phishing attempts instantly, and provides actionable threat intelligence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-base px-8 py-4 group"
            >
              <Search size={20} />
              Scan URL Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#features">
              <button className="btn-secondary text-base px-8 py-4">
                Learn More
                <ChevronRight size={18} />
              </button>
            </a>
          </motion.div>

          {/* Live threat feed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Live Threat Feed</span>
            </div>
            <div className="space-y-2">
              {threats.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-900/50"
                >
                  <span className="text-slate-300 text-sm font-mono">{t.url}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">Risk: {t.score}</span>
                    <span className={t.status === 'safe' ? 'badge-safe' : 'badge-phishing'}>
                      {t.status === 'safe' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                      {t.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center group hover:scale-105 transition-transform cursor-default"
              >
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 cyber-grid">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Capabilities</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">
              Enterprise Security <span className="gradient-text">Features</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything your security team needs to detect, analyze, and respond to phishing threats in real time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon size={24} style={{ color: f.color }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Process</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">
              How <span className="gradient-text">PhishGuard</span> Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit URL', desc: 'Paste any suspicious URL into our scanner', icon: Search, color: '#3B82F6' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI inspects 50+ security indicators', icon: Brain, color: '#8B5CF6' },
              { step: '03', title: 'Threat Lookup', desc: 'Cross-referenced against global threat databases', icon: Database, color: '#F59E0B' },
              { step: '04', title: 'Instant Report', desc: 'Get a detailed security report in under 2 seconds', icon: TrendingUp, color: '#22C55E' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate-700 to-transparent" />
                )}
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center relative z-10"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}40` }}
                >
                  <step.icon size={28} style={{ color: step.color }} />
                </div>
                <div className="text-slate-600 text-4xl font-black mb-2">{step.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <div className="relative">
              <Shield size={48} className="text-blue-400 mx-auto mb-6 float" />
              <h2 className="text-4xl font-black text-white mb-4">
                Start Protecting Your Organization <span className="gradient-text">Today</span>
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Join 50,000+ security teams using PhishGuard AI to stay ahead of threats.
              </p>
              <Link to="/signup">
                <button className="btn-primary text-base px-10 py-4">
                  <Shield size={20} />
                  Get Started Free
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield size={16} className="text-white" />
              </div>
              <span className="text-white font-bold">PhishGuard AI</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2025 PhishGuard AI. Enterprise Cybersecurity Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-400 text-xs">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
