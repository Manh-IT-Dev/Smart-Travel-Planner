import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Zap, 
  RefreshCw, 
  Trash2, 
  Cpu, 
  Layers, 
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RedisDashboardProps {
  lang: 'vi' | 'en';
  refreshTrigger?: number; // allow triggering reloads
  theme?: 'light' | 'dark';
}

export default function RedisDashboard({ lang, refreshTrigger, theme = 'dark' }: RedisDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('');
  const isDark = theme === 'dark';

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/redis/stats');
      if (res.ok) {
        const data = await res.json();
        if (data) setStats(data);
      }
    } catch (err) {
      console.error("Failed to read Redis server statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlushCache = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/redis/clear', { method: 'POST' });
      if (res.ok) {
        setStatusText(lang === 'vi' ? 'Đã xóa bộ nhớ đệm!' : 'Cache flushed successfully!');
        setTimeout(() => setStatusText(''), 3000);
        await fetchStats();
      }
    } catch (e) {
      console.error("Flush Redis cache failed:", e);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-update stats every 6 seconds to capture background cache creations and countdown TTLs
    const timer = setInterval(() => {
      fetchStats();
    }, 6000);
    return () => clearInterval(timer);
  }, [refreshTrigger]);

  const totalRequests = stats ? stats.hits + stats.misses : 0;
  const hitPercentage = stats && totalRequests > 0 
    ? Math.round((stats.hits / totalRequests) * 100) 
    : 0;

  return (
    <div id="redis-metrics-widget-container" className={`rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden border transition-all duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100/50'
    }`}>
      {/* Visual glowing accent */}
      <div className="absolute top-0 right-10 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-cyan-500 fill-cyan-500/10" />
          <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'vi' ? 'Bộ nhớ đệm Cloud Redis' : 'Cloud Redis Cache'}
          </h3>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="p-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </span>
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest font-mono">
            Active
          </span>
        </div>
      </div>

      {/* Primary Server Information */}
      <div className={`rounded-xl p-3 border flex items-center justify-between gap-2.5 ${
        isDark ? 'bg-slate-950/55 border-slate-800/60' : 'bg-slate-50 border-slate-100/80 shadow-sm'
      }`}>
        <div className="flex items-center space-x-2.5 min-w-0">
          <Cpu className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400 shrink-0 stroke-[1.5]" />
          <div className="min-w-0 space-y-0.5">
            <p className={`text-[9px] uppercase tracking-wider font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'vi' ? 'DỊCH VỤ CLOUD' : 'CLOUD ENDPOINT'}
            </p>
            <p className={`text-xs font-mono font-bold truncate leading-none ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              GCP Memorystore (Redis)
            </p>
          </div>
        </div>
        
        <button 
          onClick={fetchStats}
          disabled={loading}
          className={`p-1 px-1.5 rounded-lg transition-all cursor-pointer border border-transparent disabled:opacity-50 ${
            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 shadow-sm'
          }`}
          title={lang === 'vi' ? 'Lấy lại dữ liệu' : 'Refresh Telemetry'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Micro Metrics Rows */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className={`p-2.5 rounded-xl space-y-1 border ${
          isDark ? 'bg-slate-950/20 border-slate-800/45' : 'bg-slate-50 border-slate-100 shadow-sm'
        }`}>
          <span className={`text-[9px] block uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {lang === 'vi' ? 'Hit Rate (Hiệu suất)' : 'Hit Efficiency'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-300">
              {hitPercentage}%
            </span>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ({stats?.hits || 0}/{totalRequests})
            </span>
          </div>
        </div>

        <div className={`p-2.5 rounded-xl space-y-1 border ${
          isDark ? 'bg-slate-950/20 border-slate-800/45' : 'bg-slate-50 border-slate-100 shadow-sm'
        }`}>
          <span className={`text-[9px] block uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {lang === 'vi' ? 'Dung lượng cache' : 'Memory Occupied'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-lg font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {stats ? (stats.memoryUsedBytes / 1024).toFixed(2) : '4.00'}
            </span>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-550'}`}>KB</span>
          </div>
        </div>
      </div>

      {/* Cache Keys Overview section */}
      <div className="space-y-2">
        <div className={`flex items-center justify-between text-[10px] font-bold px-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>{lang === 'vi' ? 'Khóa lưu trữ active' : 'Active Keys in Memory'} ({stats?.keyCount || 0})</span>
          <div className={`h-1 w-12 rounded overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-cyan-500 transition-all duration-500" 
              style={{ width: `${Math.min(100, (stats?.keyCount || 0) * 20)}%` }}
            ></div>
          </div>
        </div>

        {/* List of keys from redis */}
        {!stats || stats.keys.length === 0 ? (
          <div className={`py-2.5 px-3 border border-dashed rounded-xl text-center ${
            isDark ? 'bg-slate-950/10 border-slate-850' : 'bg-slate-50 border-slate-200 shadow-inner'
          }`}>
            <p className={`text-[10px] font-medium italic ${isDark ? 'text-slate-600' : 'text-slate-450'}`}>
              {lang === 'vi' ? 'Khay nhớ đệm rỗng. Hãy tìm kiếm/tạo lịch trình!' : 'Cache buffer currently empty. Query to populate weather.'}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-mono text-[9px] pr-1">
            {stats.keys.map((k: any, i: number) => {
              // Extract descriptive label e.g., weather:london, itinerary:hanoi
              const label = k.key.replace(/^redis:/, '').split(':').slice(0, 3).join(':');
              return (
                <div key={i} className={`flex items-center justify-between p-1.5 rounded-lg border gap-2 transition-all ${
                  isDark 
                    ? 'bg-slate-950/40 border-slate-800/50 hover:border-slate-800'
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }`}>
                  <span className={`truncate flex-1 font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`} title={k.key}>
                    🔑 {label}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 text-[8px]">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-450'}>{(k.sizeBytes / 1024).toFixed(1)}k</span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center bg-amber-400/5 px-1 rounded border border-amber-400/10 gap-0.5 font-bold">
                      <Clock className="w-2 h-2 shrink-0" />
                      {k.ttl}s
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action controls */}
      <div className={`pt-2 flex items-center justify-between border-t gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        {statusText ? (
          <div className="flex items-center space-x-1 text-[10px] text-emerald-500 font-bold transition-all">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{statusText}</span>
          </div>
        ) : (
          <span className={`text-[9px] leading-tight max-w-[140px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>
            {lang === 'vi' 
              ? 'Tăng tốc tải trang 10x, ngăn chặn lỗi 503 từ API.'
              : 'Speed up loads 10x, prevent API throttle errors.'}
          </span>
        )}

        <button
          onClick={handleFlushCache}
          disabled={actionLoading || !stats || stats.keyCount === 0}
          className={`flex items-center space-x-1.5 text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-40 select-none ${
            isDark 
              ? 'bg-slate-950 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 text-slate-400 hover:text-red-400 disabled:hover:bg-slate-950 disabled:hover:text-slate-400 disabled:hover:border-slate-800' 
              : 'bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 shadow-sm disabled:hover:bg-white disabled:hover:text-slate-500 disabled:hover:border-slate-200'
          }`}
          title={lang === 'vi' ? 'Làm rỗng Redis' : 'Flush Redis Buffer'}
        >
          <Trash2 className="w-3 h-3 shrink-0" />
          <span>{lang === 'vi' ? 'Xóa Cache' : 'Flush Cache'}</span>
        </button>
      </div>
    </div>
  );
}
