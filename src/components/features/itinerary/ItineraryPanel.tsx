import React from 'react';
import { ItineraryPlan } from '../../../types';
import { translations } from '../../../lib/translations';
import { MapPin, Info, ArrowRight, ExternalLink, Sparkles, Navigation, Bookmark } from 'lucide-react';

interface ItineraryPanelProps {
  plan: ItineraryPlan | null;
  onGenerate: () => void;
  loading: boolean;
  lang: 'vi' | 'en';
  currentUser: any;
  isSaved?: boolean;
  onSave?: () => void;
  saving?: boolean;
  theme?: 'light' | 'dark';
}

export default function ItineraryPanel({
  plan,
  onGenerate,
  loading,
  lang,
  currentUser,
  isSaved = false,
  onSave,
  saving = false,
  theme = 'dark'
}: ItineraryPanelProps) {
  const t = translations[lang];
  const isDark = theme === 'dark';

  // Helper to resolve activity icons
  const getActivityEmoji = (type: string) => {
    const tLower = type.toLowerCase();
    if (tLower.includes('cafe') || tLower.includes('dining')) return '☕';
    if (tLower.includes('indoor') || tLower.includes('museum') || tLower.includes('art')) return '🏛️';
    if (tLower.includes('outdoor') || tLower.includes('park') || tLower.includes('lake')) return '🌳';
    if (tLower.includes('sport') || tLower.includes('fitness') || tLower.includes('gym')) return '🏋️';
    if (tLower.includes('shopping') || tLower.includes('mall')) return '🛍️';
    if (tLower.includes('sightseeing') || tLower.includes('camera') || tLower.includes('temple')) return '📸';
    return '🗺️';
  };

  const getTransportEmoji = (mode: string) => {
    switch (mode) {
      case 'walking': return '🚶';
      case 'cycling': return '🚲';
      case 'driving': return '🚗';
      case 'transit': return '🚌';
      default: return '🚗';
    }
  };

  return (
    <div id="ai-itinerary-panel-container" className={`rounded-2xl p-6 shadow-xl space-y-6 relative overflow-hidden transition-all duration-300 border ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100/50'
    }`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none ${isDark ? 'bg-teal-500/5' : 'bg-teal-500/[0.02]'}`}></div>

      {/* Panel title */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.aiPlannerTitle}
            </h2>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-650'}`}>
            {t.aiPlannerDesc}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={onGenerate}
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-xs tracking-wide shadow-lg shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center space-x-1 shrink-0 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="animate-ping w-2 h-2 rounded-full bg-slate-950"></span>
                <span>{t.generating}</span>
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>{t.generatePlanBtn}</span>
              </>
            )}
          </button>

          {plan && !loading && onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center space-x-1.5 ${
                isSaved 
                  ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30' 
                  : isDark
                    ? 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
              title={
                !currentUser 
                  ? (lang === 'vi' ? 'Đăng nhập Google để lưu' : 'Sign in to save') 
                  : isSaved 
                    ? (lang === 'vi' ? 'Đã lưu vào Firestore' : 'Unsave from Firestore') 
                    : (lang === 'vi' ? 'Lưu lộ trình thông minh' : 'Save smart plan')
              }
            >
              <Bookmark className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isSaved ? 'fill-rose-500 text-rose-500 scale-105' : 'text-slate-450 hover:scale-105'}`} />
              <span className="hidden sm:inline">
                {saving 
                  ? (lang === 'vi' ? 'Đang lưu...' : 'Saving...') 
                  : isSaved 
                    ? (lang === 'vi' ? 'Trực tuyến' : 'Cloud Sync') 
                    : (lang === 'vi' ? 'Lưu Lộ Trình' : 'Save Plan')}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Loading state message outlines */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-4" id="itinerary-loading-spinner">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin"></div>
            <Sparkles className="w-5 h-5 text-teal-500 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-teal-600 dark:text-teal-300">
              {lang === 'vi' ? 'Đang phân tích thời tiết và sở thích...' : 'Analyzing climate vectors & user interests...'}
            </p>
            <p className={`text-xs italic max-w-xs mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'vi' 
                ? 'Gemini đang tìm kiếm địa điểm thực tế và sắp xếp thời gian đi lại an toàn nhất.' 
                : 'Gemini is querying real local venues and organizing high-comfort travel intervals.'}
            </p>
          </div>
        </div>
      )}

      {/* No Plan layout state */}
      {!plan && !loading && (
        <div className={`py-12 text-center space-y-4 border border-dashed rounded-2xl ${
          isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-slate-50/50'
        }`} id="itinerary-empty-prompt">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto text-lg border ${
            isDark ? 'bg-slate-800/50 border-slate-700/30 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
          }`}>
            🗺️
          </div>
          <p className={`text-sm max-w-md mx-auto leading-relaxed px-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.noPlanYet}
          </p>
        </div>
      )}

      {/* Platted Itinerary results */}
      {plan && !loading && (
        <div className="space-y-6" id="itinerary-results-inner">
          {/* Fallback Warning Banner */}
          {plan._isFallback && (
            <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
              isDark ? 'bg-amber-500/10 border-amber-500/25 text-amber-300' : 'bg-amber-50 border-amber-150 text-amber-800'
            }`}>
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1 text-xs">
                <span className="font-bold block">
                  {lang === 'vi' ? '⚡ Chế Độ Dự Phòng Thời Tiết Thống Nhất' : '⚡ Combined Meteorological Fallback Active'}
                </span>
                <p className="leading-relaxed opacity-90">
                  {lang === 'vi' 
                    ? 'Hạn ngạch trí tuệ nhân tạo Gemini hiện đã cạn kiệt hoặc bị giới hạn. Chúng tôi tự động chuyển dịch lộ trình sang kho dữ liệu thực tế tại địa phương tương thích 100% với thời tiết.'
                    : 'The standard Gemini AI quota is currently restricted or fully exhausted. We successfully fell back to a high-comfort, dynamically optimized local weather guide for you.'}
                </p>
              </div>
            </div>
          )}

          {/* Summary Tips Block */}
          <div className={`border rounded-xl p-4 flex items-start space-x-3 duration-350 transition-colors ${
            isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-sm'
          }`}>
            <Info className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-850'}`}>
                {lang === 'vi' ? 'Tổng quan lộ trình & Lời khuyên' : 'Itinerary Summary & Advice'}
              </span>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600 leading-relaxed'}>
                {plan.summary}
              </p>
              <div className={`pt-2 flex items-center space-x-2 font-semibold ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>
                <span>{getTransportEmoji(plan.transportMode)}</span>
                <span>
                  {lang === 'vi' ? 'Phương tiện chính:' : 'Primary transport:'} <strong className={`capitalize ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{translations[lang][plan.transportMode as any] || plan.transportMode}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Timeline list of items */}
          <div className={`relative border-l ml-3.5 pl-5 space-y-6 ${isDark ? 'border-slate-800' : 'border-slate-150'}`} id="itinerary-timeline-list">
            {plan.items.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Visual Timeline bullet node */}
                <span className={`absolute -left-[30px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border text-xs shadow-sm ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  {getActivityEmoji(item.activityType)}
                </span>

                {/* Card Container */}
                <div className={`border rounded-xl p-4 space-y-3 transition-all ${
                  isDark 
                    ? 'bg-slate-950/30 border-slate-800/85 hover:border-slate-700 hover:bg-slate-950/40' 
                    : 'bg-slate-50/70 border-slate-150/80 hover:border-slate-305 hover:bg-slate-50'
                }`}>
                  {/* Time + Activity Title */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{item.time}</span>
                      <h4 className={`text-sm font-black transition-colors ${
                        isDark ? 'text-white group-hover:text-teal-300' : 'text-slate-900 group-hover:text-teal-600'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded select-none uppercase font-mono tracking-wider border ${
                      isDark ? 'bg-slate-800 border-slate-700/40 text-slate-400' : 'bg-white border-slate-205 text-slate-500 shadow-sm'
                    }`}>
                      {item.activityType}
                    </span>
                  </div>

                  {/* Location label */}
                  <div className={`flex items-center space-x-1 text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700_custom text-slate-705'}`}>
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Description body */}
                  <p className={`text-xs leading-normal ${isDark ? 'text-slate-450 text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>

                  {/* Bottom metadata - weather reason + Google map direct redirection */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t text-[11px] font-semibold ${
                    isDark ? 'border-slate-800/50 text-slate-500' : 'border-slate-100 text-slate-400'
                  }`}>
                    <div className="flex items-center space-x-1 text-teal-600 dark:text-teal-400/85 italic">
                      <Sparkles className="w-3 h-3" />
                      <span className="truncate max-w-[250px] sm:max-w-[320px]">{item.reason}</span>
                    </div>

                    {/* Google Maps link redirection */}
                    <a
                      href={item.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-1.5 transition-all text-[11px] py-1 px-2.5 rounded-lg border ${
                        isDark 
                          ? 'text-rose-400 hover:text-rose-300 bg-slate-800/50 hover:bg-slate-800 border-slate-800/60' 
                          : 'text-rose-600 hover:text-rose-700 bg-white hover:bg-slate-100 border-slate-200 shadow-sm font-bold'
                      }`}
                    >
                      <Navigation className="w-3 h-3 fill-rose-500/10" />
                      <span>{t.mapsLinkBtn}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
