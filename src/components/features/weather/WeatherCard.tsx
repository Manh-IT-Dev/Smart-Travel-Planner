import React from 'react';
import { WeatherData } from '../../../types';
import { translations } from '../../../lib/translations';
import { getWeatherDesc, getWeatherIcon, getUVText } from '../../../lib/weatherUtils';
import { Wind, Droplet, RefreshCw, Clock, Calendar, ShieldAlert } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  lang: 'vi' | 'en';
  onRefresh: () => void;
  loading: boolean;
  theme?: 'light' | 'dark';
}

export default function WeatherCard({
  weather,
  lang,
  onRefresh,
  loading,
  theme = 'dark',
}: WeatherCardProps) {
  const t = translations[lang];
  const isDark = theme === 'dark';

  // Map WMO codes to description
  const weatherText = getWeatherDesc(weather.current.weatherCode, lang);
  const weatherIcon = getWeatherIcon(weather.current.weatherCode);

  // Parse fetched time
  const formatTime = (isoString: string) => {
    try {
      const date = new Error().stack ? new Date(isoString) : new Date();
      return date.toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // Extract UV text
  const uvVal = weather.daily[0]?.uvIndexMax ?? 0;
  const uvInfo = getUVText(uvVal, lang);

  return (
    <div id="weather-card-container" className="space-y-6">
      {/* Real-time weather block */}
      <div className={`rounded-2xl p-6 shadow-xl overflow-hidden relative border transition-all duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100/50'
      }`}>
        <div className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-blue-500/5' : 'bg-blue-500/[0.02]'}`}></div>
        <div className={`absolute -bottom-8 -left-8 w-44 h-44 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-teal-500/5' : 'bg-teal-500/[0.02]'}`}></div>

        {/* Card Title & Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {weather.coordinates.name}
            </h1>
            <p className={`text-xs mt-0.5 max-w-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>
              {weather.coordinates.country || weather.coordinates.admin1 || ''} • Synced: {formatTime(weather.fetchedAt)}
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`p-2 rounded-xl transition-all disabled:opacity-40 cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-teal-400' : 'bg-slate-100 hover:bg-slate-200 text-teal-600 shadow-sm'
            } ${loading ? 'animate-spin' : ''}`}
            title="Refresh weather data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Current Meteorology Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-b pb-6 ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
          <div className="flex items-center space-x-5">
            <span className="text-5xl md:text-6xl select-none animate-pulse" role="img" aria-label="weather status">
              {weatherIcon}
            </span>
            <div>
              <div className="flex items-start">
                <span className={`text-4xl md:text-5xl font-black font-sans tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {Math.round(weather.current.temperature)}
                </span>
                <span className="text-lg md:text-xl font-bold text-teal-500 ml-0.5">{t.tempUnits}</span>
              </div>
              <p className={`text-sm font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{weatherText}</p>
            </div>
          </div>

          {/* Sub Grid measurements */}
          <div className="grid grid-cols-2 gap-4">
            {/* Feels Like */}
            {weather.current.apparentTemperature !== undefined && (
              <div className={`border rounded-xl p-3 ${isDark ? 'bg-slate-950/40 border-slate-800/40' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                <p className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.apparentTemp}
                </p>
                <p className={`text-sm font-extrabold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {Math.round(weather.current.apparentTemperature)}{t.tempUnits}
                </p>
              </div>
            )}
            
            {/* Humidity */}
            {weather.current.relativeHumidity !== undefined && (
              <div className={`border rounded-xl p-3 ${isDark ? 'bg-slate-950/40 border-slate-800/40' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                <p className={`text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Droplet className="w-3 h-3 text-sky-500" />
                  <span>{t.humidity}</span>
                </p>
                <p className={`text-sm font-extrabold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {weather.current.relativeHumidity}%
                </p>
              </div>
            )}

            {/* Wind velocity */}
            <div className={`border rounded-xl p-3 ${isDark ? 'bg-slate-950/40 border-slate-800/40' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
              <p className={`text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Wind className="w-3 h-3 text-teal-500" />
                <span>{t.windSpeed}</span>
              </p>
              <p className={`text-sm font-extrabold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {weather.current.windSpeed} {t.windUnits}
              </p>
            </div>

            {/* UV value */}
            <div className={`border rounded-xl p-3 ${isDark ? 'bg-slate-950/40 border-slate-800/40' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
              <p className={`text-[10px] uppercase tracking-wider font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <ShieldAlert className="w-3 h-3 text-orange-500" />
                <span>{t.uvText}</span>
              </p>
              <p className={`text-sm font-extrabold mt-1 ${uvInfo.color}`}>
                {uvVal} ({uvInfo.text})
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Forecast Strip */}
        <div className="space-y-3 mt-5">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Clock className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
            <span>{t.hourlyTitle} ({lang === 'vi' ? 'Thời gian thực' : 'Real-time'})</span>
          </h3>
          <div className="flex space-x-3 overflow-x-auto pb-3 pt-1 scrollbar-none" id="hourly-forecast-strip" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {(() => {
              // Geographically calculate target timezone offset using longitude: 15 degrees per hour
              const longitude = weather.coordinates.longitude;
              const tzOffsetHours = Math.round(longitude / 15);
              const utcMs = Date.now() + (new Date().getTimezoneOffset() * 60 * 1000);
              const targetLocalTime = new Date(utcMs + (tzOffsetHours * 60 * 60 * 1000));
              const targetTimeMs = targetLocalTime.getTime();

              // Find closest hourly prediction index
              let closestIdx = 0;
              let minDiff = Infinity;
              weather.hourly.forEach((item, index) => {
                const itemTimeMs = new Date(item.time).getTime();
                const diff = Math.abs(itemTimeMs - targetTimeMs);
                if (diff < minDiff) {
                  minDiff = diff;
                  closestIdx = index;
                }
              });

              // Slice starting from current/closest hour
              const slicedHourly = weather.hourly.slice(closestIdx, closestIdx + 12);
              
              return slicedHourly.map((item, idx) => {
                const isNow = idx === 0;
                const hourLabel = isNow 
                  ? (lang === 'vi' ? 'Bây giờ' : 'Now')
                  : new Date(item.time).toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    });
                const hourIcon = getWeatherIcon(item.weatherCode);

                return (
                  <div
                    key={idx}
                    className={`border rounded-xl p-3 flex flex-col items-center justify-between min-w-[76px] text-center shrink-0 transition-all duration-350 select-none ${
                      isNow
                        ? (isDark 
                            ? 'bg-gradient-to-b from-teal-950/60 to-slate-900 border-teal-500 shadow-lg shadow-teal-500/10 scale-105 ring-1 ring-teal-500/30' 
                            : 'bg-gradient-to-b from-teal-50 to-white border-teal-500 shadow-md shadow-teal-600/10 scale-105 ring-1 ring-teal-500/30')
                        : (isDark
                            ? 'bg-slate-950/30 border-slate-800/40 hover:border-slate-700 hover:bg-slate-950/50'
                            : 'bg-slate-50 border-slate-200/60 hover:border-slate-300 hover:bg-white shadow-xs')
                    }`}
                  >
                    <span className={`text-[11px] font-bold flex items-center justify-center space-x-1 ${
                      isNow ? 'text-teal-500' : (isDark ? 'text-slate-400' : 'text-slate-500')
                    }`}>
                      <span>{hourLabel}</span>
                      {isNow && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                      )}
                    </span>
                    <span className="text-xl my-1.5 transform hover:scale-110 transition-transform duration-200">{hourIcon}</span>
                    <span className={`text-xs font-extrabold ${isNow ? 'text-teal-600 dark:text-teal-400' : (isDark ? 'text-white' : 'text-slate-800')}`}>
                      {Math.round(item.temperature)}°
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className={`rounded-2xl p-6 shadow-xl space-y-4 border transition-all duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100/50'
      }`}>
        <h3 className={`text-sm font-bold tracking-tight flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Calendar className="w-4 h-4 text-teal-500" />
          <span>{t.dailyTitle}</span>
        </h3>
        <div className="space-y-2" id="daily-forecast-list">
          {weather.daily.map((day, idx) => {
            const dateObj = new Date(day.date);
            const weekday = dateObj.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
              weekday: 'short',
            });
            const formattedDate = dateObj.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
              month: 'numeric',
              day: 'numeric',
            });
            const icon = getWeatherIcon(day.weatherCode);
            const weatherDesc = getWeatherDesc(day.weatherCode, lang);

            return (
              <div
                key={idx}
                className={`flex items-center justify-between border rounded-xl p-3 transition-colors ${
                  isDark ? 'bg-slate-950/20 border-slate-850/20 hover:bg-slate-950/30' : 'bg-slate-50/60 border-slate-100/80 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {/* Day name */}
                <div className="w-1/4">
                  <p className={`text-xs font-black capitalize ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{weekday}</p>
                  <p className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>{formattedDate}</p>
                </div>

                {/* Status description */}
                <div className="w-1/3 flex items-center space-x-2">
                  <span className="text-lg select-none">{icon}</span>
                  <span className={`text-xs truncate hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
                    {weatherDesc}
                  </span>
                </div>

                {/* UV Index indicators */}
                <div className="w-1/6 text-center text-[10px]">
                  <span className="font-extrabold text-orange-500">UV {day.uvIndexMax}</span>
                </div>

                {/* Temperature outputs */}
                <div className="w-1/4 flex items-center justify-end space-x-2 text-right">
                  <span className={`text-xs font-black ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {Math.round(day.tempMin)}°
                  </span>
                  <div className="w-8 h-1 bg-gradient-to-r from-blue-550 to-amber-550 rounded-full opacity-35"></div>
                  <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {Math.round(day.tempMax)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
