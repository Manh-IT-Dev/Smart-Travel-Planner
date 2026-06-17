import { useState, useEffect } from 'react';
import { WeatherData, ItineraryPlan, Coordinates, WeatherAlert, UserPreferences } from '../types';
import { weatherService } from '../services/api';
import { translations } from '../lib/translations';

export function useWeather(preferences: UserPreferences) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [activePlan, setActivePlan] = useState<ItineraryPlan | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [loadingItinerary, setLoadingItinerary] = useState<boolean>(false);
  const [networkOffline, setNetworkOffline] = useState<boolean>(!navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(false);
  const [redisTrigger, setRedisTrigger] = useState<number>(0);

  const isOffline = networkOffline || simulatedOffline;
  const lang = preferences.language;
  const t = translations[lang];

  useEffect(() => {
    const goOnline = () => setNetworkOffline(false);
    const goOffline = () => setNetworkOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const fetchWeatherForLocation = async (coords: Coordinates, keepActivePlan: boolean = false) => {
    setLoadingWeather(true);
    try {
      if (isOffline) {
        const cacheKey = `cached_weather_${coords.name.toLowerCase().replace(/\s/g, '_')}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setWeatherData(JSON.parse(cached));
          if (!keepActivePlan) {
            const planKey = `cached_plan_${coords.name.toLowerCase().replace(/\s/g, '_')}`;
            const planCached = localStorage.getItem(planKey);
            setActivePlan(planCached ? JSON.parse(planCached) : null);
          }
          setLoadingWeather(false);
          return;
        }
        throw new Error(lang === 'vi' ? 'Không tìm thấy dữ liệu ngoại tuyến.' : 'No offline data.');
      }

      const data = await weatherService.fetchWeather(coords);
      setWeatherData(data);
      setRedisTrigger(prev => prev + 1);
      localStorage.setItem(`cached_weather_${coords.name.toLowerCase().replace(/\s/g, '_')}`, JSON.stringify(data));
      localStorage.setItem('last_viewed_coords', JSON.stringify(coords));

      await analyzeAlerts(data);
      if (!keepActivePlan) setActivePlan(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingWeather(false);
    }
  };

  const analyzeAlerts = async (currentWeather: WeatherData) => {
    if (isOffline) {
      // Local fallback logic (simplified)
      setWeatherAlerts([]);
      return;
    }
    try {
      const data = await weatherService.analyzeAlerts(currentWeather, preferences);
      setWeatherAlerts(data.alerts || []);
    } catch {}
  };

  const generateAIItinerary = async () => {
    if (!weatherData) return;
    setLoadingItinerary(true);
    try {
      if (isOffline) throw new Error("Offline");
      const freshPlan = await weatherService.generateItinerary(weatherData, preferences);
      setActivePlan(freshPlan);
      setRedisTrigger(prev => prev + 1);
      localStorage.setItem(`cached_plan_${weatherData.coordinates.name.toLowerCase().replace(/\s/g, '_')}`, JSON.stringify(freshPlan));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingItinerary(false);
    }
  };

  return {
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
  };
}
