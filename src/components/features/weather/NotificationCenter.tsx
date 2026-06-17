import React from 'react';
import { WeatherAlert } from '../../../types';
import { translations } from '../../../lib/translations';
import { Bell, BellOff, X, HelpCircle, AlertTriangle, CloudRain, Sun, Info } from 'lucide-react';

interface NotificationCenterProps {
  alerts: WeatherAlert[];
  onDismissAlert: (id: string) => void;
  lang: 'vi' | 'en';
  pushAlertsEnabled: boolean;
  theme?: 'light' | 'dark';
}

export default function NotificationCenter({
  alerts,
  onDismissAlert,
  lang,
  pushAlertsEnabled,
  theme = 'dark',
}: NotificationCenterProps) {
  const t = translations[lang];
  const isDark = theme === 'dark';

  const getAlertIcon = (type: string, severity: string) => {
    if (type === 'rain' || type === 'precipitation') return <CloudRain className="w-4 h-4 text-sky-500" />;
    if (type === 'uv') return <Sun className="w-4 h-4 text-orange-500" />;
    if (severity === 'danger') return <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />;
    if (severity === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />;
    return <Info className="w-4 h-4 text-teal-500 shrink-0" />;
  };

  const getAlertClasses = (severity: string) => {
    switch (severity) {
      case 'danger':
        return isDark ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return isDark ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200' : 'bg-yellow-50/70 border-yellow-200 text-yellow-800';
      default:
        return isDark ? 'bg-teal-500/10 border-teal-500/30 text-teal-200' : 'bg-teal-50 border-teal-200 text-teal-800';
    }
  };

  return (
    <div id="weather-alert-panel-container" className={`rounded-2xl p-6 shadow-xl space-y-4 transition-all duration-300 border ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100/50'
    }`}>
      {/* Title block */}
      <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center space-x-2">
          <Bell className={`w-4.5 h-4.5 ${alerts.length > 0 && pushAlertsEnabled ? 'text-red-500 animate-bounce' : 'text-slate-400'}`} />
          <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.alertsTitle}
          </h3>
        </div>
        {!pushAlertsEnabled && (
          <span className={`text-[10px] px-2 py-0.5 rounded flex items-center space-x-1 font-mono border ${
            isDark ? 'bg-slate-800/80 border-slate-700/50 text-slate-500' : 'bg-slate-100 border-slate-200/50 text-slate-400'
          }`}>
            <BellOff className="w-2.5 h-2.5" />
            <span>MUTED</span>
          </span>
        )}
      </div>

      {/* Empty notification checklist */}
      {(!pushAlertsEnabled || alerts.length === 0) ? (
        <div className={`py-6 text-center space-y-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} id="empty-alerts-illustration">
          <p className="text-xs">
            {t.alertEmpty}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1" id="active-alerts-list">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-xl p-3 flex items-start justify-between space-x-3 text-xs leading-relaxed transition-all relative ${getAlertClasses(
                alert.severity
              )}`}
            >
              <div className="flex items-start space-x-2.5 w-full pr-5">
                <span className="mt-0.5 shrink-0 select-none">
                  {getAlertIcon(alert.type, alert.severity)}
                </span>
                <div className="space-y-0.5">
                  <span className="font-bold block tracking-tight">
                    {alert.title}
                  </span>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    {alert.message}
                  </p>
                  <span className={`text-[9px] font-mono block pt-1 leading-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(alert.timestamp).toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDismissAlert(alert.id)}
                className={`absolute top-2 right-2 rounded p-0.5 transition-colors ${
                  isDark ? 'text-slate-500 hover:text-slate-350 hover:bg-slate-800/40' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Dismiss warning"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
