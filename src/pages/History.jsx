import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, ChevronUp, ChevronDown,
  CheckCircle, AlertTriangle, XCircle, Clock, Globe,
  Lock, Shield, RefreshCw, Eye
} from 'lucide-react';
import { mockScanHistory } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortKey, setSortKey] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const perPage = 8;
  const navigate = useNavigate();

  const filtered = mockScanHistory
    .filter(s => {
      const matchQ = s.url.toLowerCase().includes(query.toLowerCase()) || s.domain.toLowerCase().includes(query.toLowerCase());
      const matchF = filter === 'all' || s.status === filter;
      return matchQ && matchF;
    })
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'timestamp') { av = new Date(av); bv = new Date(bv); }
      if (sortDir === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const sort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <ChevronDown size={12} className="text-slate-600" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />;
  };

  const filterCounts = {
    all: mockScanHistory.length,
    safe: mockScanHistory.filter(s => s.status === 'safe').length,
    suspicious: mockScanHistory.filter(s => s.status === 'suspicious').length,
    phishing: mockScanHistory.filter(s => s.status === 'phishing').length,
  };

  const exportCSV = () => {
    const headers = ['URL', 'Status', 'Risk Score', 'SSL', 'Domain Age', 'Country', 'IP', 'Timestamp'];
    const rows = filtered.map(s => [s.url, s.status, s.riskScore, s.ssl, s.domainAge, s.country, s.ip, s.timestamp]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'phishguard-history.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Scan History</h1>
          <p className="text-slate-400 text-sm mt-1">{mockScanHistory.length} total scans recorded</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary text-sm py-2 px-4">
          <Download size={14} /> Export CSV
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search URLs or domains..."
              className="input-cyber pl-9 py-2.5 text-sm"
            />
          </div>
          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'safe', 'suspicious', 'phishing'].map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  filter === f
                    ? f === 'all' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : f === 'safe' ? 'bg-green-500/20 text-green-400 border-green-500/40'
                      : f === 'suspicious' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                      : 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'text-slate-400 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({filterCounts[f]})
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full table-cyber">
            <thead>
              <tr>
                <th>
                  <button className="flex items-center gap-1 hover:text-slate-300 transition-colors" onClick={() => sort('url')}>
                    URL <SortIcon k="url" />
                  </button>
                </th>
                <th>Status</th>
                <th>
                  <button className="flex items-center gap-1 hover:text-slate-300 transition-colors" onClick={() => sort('riskScore')}>
                    Risk <SortIcon k="riskScore" />
                  </button>
                </th>
                <th>SSL</th>
                <th>Domain Age</th>
                <th>Country</th>
                <th>
                  <button className="flex items-center gap-1 hover:text-slate-300 transition-colors" onClick={() => sort('timestamp')}>
                    Time <SortIcon k="timestamp" />
                  </button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paged.map((scan, i) => (
                  <motion.tr
                    key={scan.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <div>
                        <p className="text-blue-400 font-mono text-xs truncate max-w-[200px]">{scan.domain}</p>
                        <p className="text-slate-600 text-[11px] truncate max-w-[200px]">{scan.url}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-${scan.status}`}>
                        {scan.status === 'safe' ? <CheckCircle size={10} /> : scan.status === 'phishing' ? <XCircle size={10} /> : <AlertTriangle size={10} />}
                        {scan.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${scan.riskScore >= 70 ? 'text-red-400' : scan.riskScore >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {scan.riskScore}
                        </span>
                        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${scan.riskScore}%`,
                              background: scan.riskScore >= 70 ? '#EF4444' : scan.riskScore >= 40 ? '#F59E0B' : '#22C55E'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`text-xs font-semibold flex items-center gap-1 ${scan.ssl ? 'text-green-400' : 'text-red-400'}`}>
                        <Lock size={10} />
                        {scan.ssl ? 'Valid' : 'None'}
                      </span>
                    </td>
                    <td><span className="text-slate-400 text-xs">{scan.domainAge}</span></td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${scan.country === 'US' ? 'text-slate-300' : 'text-orange-400'}`}>
                        {scan.country}
                      </span>
                    </td>
                    <td>
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(scan.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => navigate('/results', { state: { url: scan.url } })}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 rounded-lg hover:bg-blue-500/10"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-700/30">
            <span className="text-slate-500 text-xs">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg glass text-slate-400 text-xs hover:text-white disabled:opacity-40 transition-all"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${page === p ? 'bg-blue-500 text-white' : 'glass text-slate-400 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg glass text-slate-400 text-xs hover:text-white disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
