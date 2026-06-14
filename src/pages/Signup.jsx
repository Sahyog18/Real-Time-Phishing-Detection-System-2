import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const perks = [
  'Free forever — no credit card required',
  '500 scans per month on free plan',
  'AI-powered phishing detection',
  'Detailed security reports',
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    signup(form.name, form.email, form.password);
    setLoading(false);
    toast.success('Account created! Welcome to PhishGuard AI.');
    navigate('/dashboard');
  };

  const strength = form.password.length >= 12 ? 'Strong' : form.password.length >= 8 ? 'Good' : form.password.length > 0 ? 'Weak' : '';
  const strengthColor = strength === 'Strong' ? '#22C55E' : strength === 'Good' ? '#F59E0B' : '#EF4444';
  const strengthWidth = strength === 'Strong' ? '100%' : strength === 'Good' ? '65%' : strength === 'Weak' ? '30%' : '0%';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 cyber-grid">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg neon-blue">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">PhishGuard AI</p>
              <p className="text-blue-400 text-xs">Security Platform</p>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Protect What<br />
            <span className="gradient-text">Matters Most</span>
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Join 50,000+ security professionals using PhishGuard AI to stay ahead of phishing threats.
          </p>
          <div className="space-y-4">
            {perks.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="md:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">PhishGuard AI</span>
            </Link>
          </div>

          <div className="glass-card p-8">
            <h1 className="text-2xl font-black text-white mb-1">Create Account</h1>
            <p className="text-slate-400 text-sm mb-6">Start your free security journey</p>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={form.name} onChange={set('name')} placeholder="Alex Chen" className="input-cyber pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" className="input-cyber pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="Min. 8 characters"
                    className="input-cyber pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Password strength</span>
                      <span style={{ color: strengthColor }}>{strength}</span>
                    </div>
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: strengthWidth, backgroundColor: strengthColor }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={set('confirm')}
                    placeholder="Repeat password"
                    className="input-cyber pl-10"
                  />
                  {form.confirm && form.password === form.confirm && (
                    <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-400" />
                  )}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary w-full justify-center py-3.5 text-base mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>Create Free Account <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-4">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>

            <p className="text-center text-slate-500 text-sm mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
