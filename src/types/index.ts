export interface UserPreferences {
  language: 'vi' | 'en';
  theme: 'dark' | 'light';
  preferredActivities: string[]; // e.g., 'outdoor', 'indoor', 'sport', 'sightseeing', 'cafe', 'shopping'
  transportMode: 'walking' | 'cycling' | 'driving' | 'transit';
  tempTolerance: 'cold' | 'temperate' | 'hot';
  uvTolerance: 'low' | 'moderate' | 'high';
  pushAlertsEnabled: boolean;
  historyNotifications: WeatherAlert[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
  admin1?: string;
}

export interface WeatherCondition {
  temperature: number;
  apparentTemperature?: number;
  relativeHumidity?: number;
  weatherCode: number;
  weatherText: string;
  windSpeed: number;
  rain: number;
  showers: number;
  snowfall: number;
  uvIndex?: number;
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  weatherText: string;
  tempMin: number;
  tempMax: number;
  precipitationSum: number;
  uvIndexMax: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  weatherText: string;
}

export interface WeatherData {
  coordinates: Coordinates;
  current: WeatherCondition;
  daily: ForecastDay[];
  hourly: HourlyForecast[];
  fetchedAt: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  googleMapsUrl: string;
  activityType: string;
  reason: string; // Weather-justification for this time/place
}

export interface ItineraryPlan {
  id: string;
  date: string;
  locationName: string;
  summary: string;
  items: ItineraryItem[];
  transportMode: string;
  generatedAt: string;
  suitabilityScore?: number; // percentage match, e.g. 95
  userRating?: number; // 1-5 star user rating
  _isFallback?: boolean; // Indicates if this is a zero-quota smart fallback plan
}

export interface WeatherAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  type: string; // 'rain', 'temperature', 'uv', 'wind'
  timestamp: string;
  read: boolean;
}
