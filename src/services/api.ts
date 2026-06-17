import { WeatherData, ItineraryPlan, Coordinates, UserPreferences } from '../types';

export const weatherService = {
  async fetchWeather(coords: Coordinates): Promise<WeatherData> {
    const response = await fetch(`/api/weather?lat=${coords.latitude}&lon=${coords.longitude}&name=${encodeURIComponent(coords.name)}`);
    if (!response.ok) throw new Error("Failed to pull metrics from server endpoint");
    return response.json();
  },

  async geocode(query: string, lang: string): Promise<Coordinates[]> {
    const resp = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&lang=${lang}`);
    if (!resp.ok) throw new Error("Search geocode failed");
    const data = await resp.json();
    if (data.results && data.results.length > 0) {
      return data.results.map((item: any) => ({
        latitude: item.latitude,
        longitude: item.longitude,
        name: item.name,
        country: item.country,
        admin1: item.admin1
      }));
    }
    return [];
  },

  async analyzeAlerts(weatherData: WeatherData, preferences: UserPreferences) {
    const response = await fetch('/api/analyze-weather-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weatherData, preferences })
    });
    if (!response.ok) throw new Error("Failed to analyze alerts");
    return response.json();
  },

  async generateItinerary(weatherData: WeatherData, preferences: UserPreferences): Promise<ItineraryPlan> {
    const response = await fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weatherData, preferences })
    });
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || "Failed to sync AI plan from Gemini engine");
    }
    return response.json();
  }
};

export const adminService = {
  async getRedisStats() {
    const response = await fetch("/api/redis/stats");
    return response.json();
  },
  async clearRedis() {
    const response = await fetch("/api/redis/clear", { method: 'POST' });
    return response.json();
  }
};
