import React from 'react';
import { UserPreferences } from '../../../types';
import { translations } from '../../../lib/translations';
import { Settings, Check, Globe, Moon, Sun, Heart, Navigation, Thermometer, ShieldAlert } from 'lucide-react';

interface PreferenceConfigProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  lang: 'vi' | 'en';
}

export default function PreferenceConfig({
  preferences,
  onUpdatePreferences,
  lang,
}: PreferenceConfigProps) {
  const t = translations[lang];

  const activityOptions = [
    { value: 'outdoor', label: t.outdoor },
    { value: 'indoor', label: t.indoor },
    { value: 'sport', label: t.sport },
    { value: 'sightseeing', label: t.sightseeing },
    { value: 'cafe', label: t.cafe },
    { value: 'shopping', label: t.shopping },
  ];

  const transportOptions = [
    { value: 'walking', label: t.walking, icon: '🚶' },
    { value: 'cycling', label: t.cycling, icon: '🚲' },
    { value: 'driving', label: t.driving, icon: '🚗' },
    { value: 'transit', label: t.transit, icon: '🚌' },
  ];

  const tempOptions = [
    { value: 'cold', label: t.cold },
    { value: 'temperate', label: t.temperate },
    { value: 'hot', label: t.hot },
  ];

  const uvOptions = [
    { value: 'low', label: t.low },
    { value: 'moderate', label: t.moderate },
    { value: 'high', label: t.high },
  ];

  const toggleActivity = (val: string) => {
    const current = [...preferences.preferredActivities];
    if (current.includes(val)) {
      onUpdatePreferences({ preferredActivities: current.filter(x => x !== val) });
    } else {
      onUpdatePreferences({ preferredActivities: [...current, val] });
    }
  };

  const isDark = preferences.theme === 'dark';

  return (
    <div id="preference-config-panel" className={`border rounded-2xl p-6 shadow-xl space-y-6 transition-all duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100/50'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-teal-500" />
          <h2 className={`text-lg font-bold font-sans tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.preferencesTitle}
          </h2>
        </div>
        <div className={`flex rounded-lg p-0.5 border ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-slate-100 border-slate-200'}`} id="language-theme-toggle">
          {/* Language toggle */}
          <button
            onClick={() => onUpdatePreferences({ language: preferences.language === 'vi' ? 'en' : 'vi' })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center space-x-1 transition-colors text-teal-600 dark:text-teal-400 ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200/60'
            }`}
            title="Switch Language / Đổi ngôn ngữ"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{preferences.language.toUpperCase()}</span>
          </button>
          
          <span className={`w-px self-stretch my-1 ${isDark ? 'bg-slate-700' : 'bg-slate-250'}`}></span>
 
          {/* Theme switcher */}
          <button
            onClick={() => onUpdatePreferences({ theme: preferences.theme === 'light' ? 'dark' : 'light' })}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center transition-colors text-yellow-600 dark:text-yellow-400 ${
              isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200/60'
            }`}
            title="Switch Theme / Đổi giao diện"
          >
            {preferences.theme === 'light' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
 
      {/* Activities Choice */}
      <div className="space-y-2">
        <label className={`text-sm font-medium flex items-center space-x-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Heart className="w-4 h-4 text-rose-500" />
          <span>{t.activitiesPref}</span>
        </label>
        <div className="grid grid-cols-2 gap-2" id="activity-selectors">
          {activityOptions.map((opt) => {
            const selected = preferences.preferredActivities.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleActivity(opt.value)}
                className={`py-2 px-3 text-xs rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  selected
                    ? 'bg-teal-500/15 border-teal-500/50 text-teal-600 dark:text-teal-300 font-bold shadow-sm'
                    : isDark
                      ? 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{opt.label}</span>
                {selected && <Check className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
 
      {/* Transit choice */}
      <div className="space-y-2">
        <label className={`text-sm font-medium flex items-center space-x-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <Navigation className="w-4 h-4 text-emerald-500" />
          <span>{t.transportPref}</span>
        </label>
        <div className="grid grid-cols-2 gap-2" id="transport-selectors">
          {transportOptions.map((opt) => {
            const selected = preferences.transportMode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onUpdatePreferences({ transportMode: opt.value as any })}
                className={`py-2 px-3 text-xs rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                  selected
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-300 font-bold'
                    : isDark
                      ? 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="text-sm">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
 
      {/* Weather tolerances */}
      <div className="grid grid-cols-2 gap-4">
        {/* Heat tolerance */}
        <div className="space-y-2">
          <label className={`text-xs font-medium flex items-center space-x-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate">{t.tempTolerance}</span>
          </label>
          <select
            value={preferences.tempTolerance}
            onChange={(e) => onUpdatePreferences({ tempTolerance: e.target.value as any })}
            className={`w-full border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            {tempOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
 
        {/* UV tolerance */}
        <div className="space-y-2">
          <label className={`text-xs font-medium flex items-center space-x-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Sun className="w-3.5 h-3.5 text-orange-500" />
            <span className="truncate">{t.uvTolerance}</span>
          </label>
          <select
            value={preferences.uvTolerance}
            onChange={(e) => onUpdatePreferences({ uvTolerance: e.target.value as any })}
            className={`w-full border rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            {uvOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
 
      {/* Push status alerts toggle */}
      <div className={`flex items-center justify-between pt-2 border-t mt-4 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-purple-500" />
          <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.pushAlerts}</span>
        </div>
        <button
          onClick={() => onUpdatePreferences({ pushAlertsEnabled: !preferences.pushAlertsEnabled })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            preferences.pushAlertsEnabled ? 'bg-teal-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}
          id="push-alerts-toggle-button"
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              preferences.pushAlertsEnabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
