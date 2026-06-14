import React, { useState } from 'react';
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { notificationData } from '../../data/mockData';

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const { isDark, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const unread = notificationData.filter(n => !n.read).length;

  const notifColors = {
    threat: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
    success: { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-400' },
    warning: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    info: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  };

  return (
    <header className="h-16 glass border-b border-slate-700/30 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-slate-400 hover:text-white transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Search URLs, domains..."
            className="input-cyber pl-9 py-2 w-72 text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifs(s => !s)}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass-card z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                  <span className="text-white font-semibold text-sm">Notifications</span>
                  {unread > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                      {unread} new
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notificationData.map((n) => {
                    const c = notifColors[n.type];
                    return (
                      <div
                        key={n.id}
                        className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${!n.read ? 'bg-slate-800/20' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${c.dot} ${!n.read ? 'animate-pulse' : 'opacity-40'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200 text-xs leading-relaxed">{n.message}</p>
                            <p className="text-slate-500 text-xs mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 text-center">
                  <button className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
