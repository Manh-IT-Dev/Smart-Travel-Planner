import React, { useState, useEffect, useRef } from 'react';
import { translations } from './lib/translations';
import { 
  isFirebaseEnabled, 
  auth, 
  googleProvider, 
  db,
  saveFavoriteItinerary,
  deleteFavoriteItinerary
} from './lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

import { useAuth } from './hooks/useAuth';
import { usePreferences } from './hooks/usePreferences';
import { useWeather } from './hooks/useWeather';
import { weatherService } from './services/api';
import { Coordinates, ItineraryPlan } from './types';

import PreferenceConfig from './components/features/preferences/PreferenceConfig';
import WeatherCard from './components/features/weather/WeatherCard';
import ItineraryPanel from './components/features/itinerary/ItineraryPanel';
import NotificationCenter from './components/features/weather/NotificationCenter';
import OfflineIndicator from './components/layout/OfflineIndicator';
import SavedItineraries from './components/features/itinerary/SavedItineraries';
import RedisDashboard from './components/features/admin/RedisDashboard';

import { 
  CloudSun, 
  Search, 
  LogOut, 
  LogIn
} from 'lucide-react';

const DEFAULT_COORDS: Coordinates = {
  latitude: 21.0285,
  longitude: 105.8542,
  name: "Hanoi",
  country: "Vietnam"
};

export default function App() {
  const { currentUser, authChecking } = useAuth();
  const { preferences, updatePreferences } = usePreferences(currentUser);
  const {
    weatherData,
    setWeatherData,
    activePlan,
    setActivePlan,
    weatherAlerts,
    setWeatherAlerts,
    loadingWeather,
    loadingItinerary,
    isOffline,
    simulatedOffline,
    setSimulatedOffline,
    redisTrigger,
    fetchWeatherForLocation,
    generateAIItinerary
  } = useWeather(preferences);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Coordinates[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [favoritesList, setFavoritesList] = useState<any[]>([]);
  const [savingFavorite, setSavingFavorite] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const lang = preferences.language;
  const t = translations[lang];

  useEffect(() => {
    if (!isFirebaseEnabled || !db || !currentUser) {
      setFavoritesList([]);
      return;
    }
    const q = query(
      collection(db, "users", currentUser.uid, "favorites"),
      orderBy("savedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => list.push(doc.data()));
      setFavoritesList(list);
    }, (error) => {
      console.error("App.tsx favorites collection listener failed:", error);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleSignIn = async () => {
    if (!isFirebaseEnabled || !auth || !googleProvider) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google authentication error:", err);
    }
  };

  const handleSignOut = async () => {
    if (auth) await signOut(auth);
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery?.trim()) return;

    if (isOffline) {
      const possibleName = searchQuery.trim().toLowerCase().replace(/\s/g, '_');
      const cached = localStorage.getItem(`cached_weather_${possibleName}`);
      if (cached) {
        fetchWeatherForLocation(JSON.parse(cached).coordinates);
      }
      return;
    }

    try {
      const results = await weatherService.geocode(searchQuery, lang);
      if (results.length > 0) {
        setSearchResults(results);
        setShowSearchResults(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('last_viewed_coords');
    if (saved) {
      try {
        fetchWeatherForLocation(JSON.parse(saved));
        return;
      } catch {}
    }
    fetchWeatherForLocation(DEFAULT_COORDS);
  }, []);

  const handleDismissAlert = (id: string) => {
    setWeatherAlerts(prev => prev.filter(a => a.id !== id));
  };

  const isPlanSaved = activePlan && favoritesList.some(item => item.id === activePlan.id);

  const handleSaveFavorite = async () => {
    if (!currentUser) {
      handleSignIn();
      return;
    }
    if (!activePlan) return;
    setSavingFavorite(true);
    try {
      if (isPlanSaved) {
        const savedItem = favoritesList.find(item => item.id === activePlan.id);
        if (savedItem) await deleteFavoriteItinerary(currentUser.uid, savedItem.id);
      } else {
        await saveFavoriteItinerary(currentUser.uid, activePlan);
      }
    } catch (err) {
      console.error("Cloud favorites operation failed:", err);
    } finally {
      setSavingFavorite(false);
    }
  };

  const handleSelectFavoritePlan = async (plan: ItineraryPlan) => {
    setActivePlan(plan);
    setSearchQuery(plan.locationName);
    const possibleName = plan.locationName.toLowerCase().replace(/\s/g, '_');
    const cachedWeather = localStorage.getItem(`cached_weather_${possibleName}`);
    if (cachedWeather) setWeatherData(JSON.parse(cachedWeather));

    if (!isOffline) {
      try {
        const results = await weatherService.geocode(plan.locationName, lang);
        if (results.length > 0) await fetchWeatherForLocation(results[0], true);
      } catch {}
    }
  };

  const isDark = preferences.theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`} id="application-root">
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${
        isDark ? 'border-slate-800/60 bg-slate-950/70 text-slate-100' : 'border-slate-200/80 bg-white/85 text-slate-800 shadow-sm shadow-slate-100/40'
      } py-4 px-6`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 select-none">
            <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/15">
              <CloudSun className="w-5.5 h-5.5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className={`text-md font-extrabold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.appTitle}</h1>
              <p className={`text-[10px] mt-1 font-medium tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.tagline}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-1 sm:max-w-md justify-end">
            <div ref={searchRef} className="relative flex-1 max-w-sm">
              <form onSubmit={handleLocationSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchQuery(val);
                    if (!val.trim()) setShowSearchResults(false);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) setShowSearchResults(true);
                  }}
                  placeholder={t.searchPlaceholder}
                  className={`w-full border rounded-xl py-2 pl-3.5 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute right-2 top-1.5 p-1 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
              {showSearchResults && searchResults.length > 0 && (
                <div className={`absolute left-0 right-0 mt-2 rounded-xl shadow-2xl p-1 z-50 text-xs border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {searchResults.map((coords, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        fetchWeatherForLocation(coords);
                        setShowSearchResults(false);
                      }}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                      }`}
                    >
                      {coords.name}, {coords.admin1 || ''} ({coords.country || 'Global'})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div id="authentication-action-container">
              {authChecking ? (
                <div className="w-8 h-8 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin"></div>
              ) : currentUser ? (
                <div className="flex items-center space-x-2">
                  <img src={currentUser.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full border border-teal-500/40" />
                  <button
                    onClick={handleSignOut}
                    className={`p-2 border rounded-xl transition-colors ${
                      isDark ? 'text-slate-400 hover:text-red-400 border-slate-800' : 'text-slate-500 hover:text-red-500 border-slate-200 shadow-sm'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className={`p-2.5 border rounded-xl flex items-center space-x-1.5 transition-colors ${
                    isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-500" />
                  <span className={`text-[10px] font-bold hidden sm:inline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.signinGoogle}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <OfflineIndicator isOffline={isOffline} onToggleSimulatedOffline={() => setSimulatedOffline(!simulatedOffline)} lang={lang} theme={preferences.theme} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-4 space-y-6 flex flex-col justify-start">
            <PreferenceConfig preferences={preferences} onUpdatePreferences={updatePreferences} lang={lang} />
            <NotificationCenter alerts={weatherAlerts} onDismissAlert={handleDismissAlert} lang={lang} pushAlertsEnabled={preferences.pushAlertsEnabled} theme={preferences.theme} />
            <SavedItineraries currentUser={currentUser} onSelectPlan={handleSelectFavoritePlan} lang={lang} activePlanId={activePlan?.id} theme={preferences.theme} />
            {currentUser?.email === 'manhnguyen0865280164@gmail.com' && <RedisDashboard lang={lang} refreshTrigger={redisTrigger} theme={preferences.theme} />}
          </section>
          <section className="lg:col-span-8 space-y-6">
            {loadingWeather ? (
              <div className={`border rounded-2xl p-16 flex flex-col items-center justify-center space-y-4 transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="w-10 h-10 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin"></div>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === 'vi' ? 'Đang cập nhật số liệu...' : 'Updating...'}
                </p>
              </div>
            ) : weatherData && (
              <WeatherCard weather={weatherData} lang={lang} onRefresh={() => fetchWeatherForLocation(weatherData.coordinates)} loading={loadingWeather} theme={preferences.theme} />
            )}
            <ItineraryPanel plan={activePlan} onGenerate={generateAIItinerary} loading={loadingItinerary} lang={lang} currentUser={currentUser} isSaved={isPlanSaved} onSave={handleSaveFavorite} saving={savingFavorite} theme={preferences.theme} />
          </section>
        </div>
      </main>
      <footer className={`border-t py-8 text-center text-xs font-medium transition-colors ${
        isDark ? 'border-slate-900 bg-slate-950 text-slate-600' : 'border-slate-200 bg-white text-slate-400'
      }`}>
        <p>{lang === 'vi' ? 'Weather AI Concierge • Google Gemini Power' : 'Weather AI Concierge • Google Gemini Power'}</p>
      </footer>
    </div>
  );
}
