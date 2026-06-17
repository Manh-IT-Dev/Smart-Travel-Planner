import React, { useEffect, useState } from 'react';
import { ItineraryPlan } from '../../../types';
import { translations } from '../../../lib/translations';
import { 
  Bookmark, 
  Trash2, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CloudLightning, 
  Sparkles,
  Lock,
  Compass,
  Star
} from 'lucide-react';
import { db, deleteFavoriteItinerary, isFirebaseEnabled, updateFavoriteItineraryRating } from '../../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface SavedItinerariesProps {
  currentUser: any;
  onSelectPlan: (plan: ItineraryPlan) => void;
  lang: 'vi' | 'en';
  activePlanId?: string;
  theme?: 'light' | 'dark';
}

export default function SavedItineraries({
  currentUser,
  onSelectPlan,
  lang,
  activePlanId,
  theme = 'dark'
}: SavedItinerariesProps) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const t = translations[lang];
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isFirebaseEnabled || !db || !currentUser) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "users", currentUser.uid, "favorites"), 
      orderBy("savedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setFavorites(list);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot subscription failed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (e: React.MouseEvent, planId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      await deleteFavoriteItinerary(currentUser.uid, planId);
    } catch (err) {
      console.error("Failed to delete favorite:", err);
    }
  };

  const handleRate = async (e: React.MouseEvent, planId: string, rating: number) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      await updateFavoriteItineraryRating(currentUser.uid, planId, rating);
    } catch (err) {
      console.error("Failed to update rating:", err);
    }
  };

  return (
    <div id="saved-itineraries-widget-container" className={`rounded-2xl p-5 shadow-xl space-y-4 border transition-all duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800 shadow-slate-100/50'
    }`}>
      {/* Title */}
      <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center space-x-2">
          <Bookmark className="w-4 h-4 text-rose-500 fill-rose-500" />
          <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'vi' ? 'Lịch trình đám mây' : 'Cloud Saved Itineraries'}
          </h3>
        </div>
      </div>

      {/* Guest Lock Screen */}
      {!currentUser ? (
        <div className={`py-6 px-4 border rounded-xl text-center space-y-3 ${
          isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100 shadow-inner'
        }`}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-1">
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {lang === 'vi' ? 'Đăng nhập để lưu lịch trình' : 'Sign in to save itineraries'}
            </p>
            <p className={`text-[10px] leading-normal max-w-[200px] mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {lang === 'vi' 
                ? 'Đồng bộ kết quả từ Gemini AI an toàn lên cơ sở dữ liệu lưu trữ đám mây.'
                : 'Safely sync weather-itineraries directly onto Cloud Firestore database.'}
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-2">
          <div className="w-5 h-5 rounded-full border-2 border-rose-500/25 border-t-rose-500 animate-spin"></div>
          <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {lang === 'vi' ? 'Đang đọc Firestore...' : 'Synchronizing cache...'}
          </p>
        </div>
      ) : favorites.length === 0 ? (
        <div className={`py-8 text-center space-y-2 border border-dashed rounded-xl ${
          isDark ? 'border-slate-800 bg-slate-950/10' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <Compass className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto stroke-[1.5]" />
          <p className={`text-[11px] leading-normal px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {lang === 'vi' 
              ? 'Chưa lưu hành trình nào. Bấm bookmark kế hoạch của bạn trên bản đồ!' 
              : 'No journeys saved yet. Click the bookmark icon next to plans to sync!'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {favorites.map((plan) => {
              const isActive = activePlanId === plan.id;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full group text-left p-3 rounded-xl border cursor-pointer relative overflow-hidden transition-all flex items-start justify-between gap-2.5 ${
                    isActive 
                      ? 'border-emerald-500/50 bg-emerald-500/[0.04]' 
                      : isDark
                        ? 'border-slate-800/80 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-800/40'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100/50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Location Name & Date */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-black truncate tracking-wide ${isDark ? 'text-rose-300' : 'text-rose-600 font-extrabold'}`}>
                        {plan.locationName}
                      </span>
                      <span className={`text-[9px] font-mono flex items-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <Calendar className="w-2.5 h-2.5 mr-0.5 shrink-0" />
                        {plan.date}
                      </span>
                    </div>

                    {/* Suitability/Match percentage */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${
                        isDark ? 'bg-teal-500/10 text-teal-400 border border-teal-500/15' : 'bg-teal-50 text-teal-700 border border-teal-100'
                      }`}>
                        🎯 {lang === 'vi' ? 'Độ phù hợp' : 'Match'}: {plan.suitabilityScore || 85}%
                      </span>
                    </div>

                    {/* Short Plan details preview */}
                    <p className={`text-[11px] truncate leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {plan.summary}
                    </p>

                    {/* Metadata line and Star rating */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-t border-dashed pt-2 mt-1 dark:border-slate-800/80 border-slate-150/60">
                      <div className={`flex items-center gap-2 text-[9.5px] font-semibold ${isDark ? 'text-slate-500' : 'text-slate-450'}`}>
                        <span>🎒 {plan.items.length} {lang === 'vi' ? 'HĐ' : 'acts'}</span>
                        <span>•</span>
                        <span className="capitalize">🚗 {translations[lang][plan.transportMode] || plan.transportMode}</span>
                      </div>

                      {/* Interactive Star rating */}
                      <div className="flex items-center space-x-0.5" onClick={(e) => e.stopPropagation()}>
                        {[1, 2, 3, 4, 5].map((starValue) => {
                          const currentRating = plan.userRating || 5;
                          const isFilled = starValue <= currentRating;
                          return (
                            <button
                              key={starValue}
                              type="button"
                              onClick={(e) => handleRate(e, plan.id, starValue)}
                              className="focus:outline-none transition-all hover:scale-125 duration-150 active:scale-95 p-0.5 flex"
                              title={`${lang === 'vi' ? 'Đánh giá' : 'Rate'} ${starValue}/5`}
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  isFilled 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-slate-350 dark:text-slate-700'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right hand side action widgets */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0 h-full justify-between">
                    <button
                      onClick={(e) => handleDelete(e, plan.id)}
                      className={`p-1 px-1.5 rounded-lg border border-transparent transition-all cursor-pointer ${
                        isDark ? 'hover:bg-red-500/10 text-slate-500 hover:text-red-400 hover:border-red-500/20' : 'hover:bg-red-50 text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm'
                      }`}
                      title={lang === 'vi' ? 'Xóa khỏi Firestore' : 'Unsave from Firestore'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isActive && (
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        {lang === 'vi' ? 'Đang mở' : 'Active'}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
