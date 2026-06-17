import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { translations } from '../../lib/translations';

interface OfflineIndicatorProps {
  isOffline: boolean;
  onToggleSimulatedOffline: () => void;
  lang: 'vi' | 'en';
  theme?: 'light' | 'dark';
}

export default function OfflineIndicator({
  isOffline,
  onToggleSimulatedOffline,
  lang,
  theme = 'dark',
}: OfflineIndicatorProps) {
  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <div
      id="connection-indicator-ribbon"
      className={`border rounded-xl p-3 flex items-center justify-between transition-all duration-300 ${
        isOffline
          ? isDark 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
          : isDark 
            ? 'bg-teal-500/5 border-teal-500/20 text-teal-300' 
            : 'bg-teal-50/50 border-teal-200/50 text-teal-700'
      }`}
    >
      <div className="flex items-center space-x-2 w-full justify-between flex-wrap gap-2 animate-fadeIn">
        <div className="flex items-center space-x-2.5 text-xs font-semibold">
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
              <span>{t.offlineActive}</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-teal-500 shrink-0" />
              <span>
                {lang === 'vi' ? 'Trực tuyến • Máy chủ khí tượng' : 'Online • Synced with Open-Meteo cloud'}
              </span>
            </>
          )}
        </div>

        {/* Offline Simulation toggle so the user can easily test the offline capability in iframe preview */}
        <button
          onClick={onToggleSimulatedOffline}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border leading-none transition-all cursor-pointer ${
            isOffline
              ? 'bg-amber-500 hover:bg-amber-450 text-slate-950 border-transparent shadow shadow-amber-500/20 font-extrabold'
              : isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-755'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 shadow-sm'
          }`}
          title="Toggle simulated offline mode for verification"
        >
          {isOffline 
            ? (lang === 'vi' ? 'Bật mạng' : 'Go Online') 
            : (lang === 'vi' ? 'Mô phỏng ngoại tuyến' : 'Simulate Offline')}
        </button>
      </div>
    </div>
  );
}
