import { Request, Response } from "express";
import { CloudRedisCache } from "../middleware/cache";
import { fetchGeocode, fetchWeather } from "../services/weather.service";
import { getGeminiClient, generateContentWithFallback } from "../services/ai.service";
import { generateLocalFallbackItinerary, generateLocalFallbackAlerts } from "../utils/fallbacks";
import { Type } from "@google/genai";

export const getGeocode = async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Missing query parameter 'q'" });
      return;
    }

    const lang = req.query.lang === "vi" ? "vi" : "en";
    const redisKey = `redis:geocode:q:${query.trim().toLowerCase()}:lang:${lang}`;

    const cached = CloudRedisCache.get(redisKey);
    if (cached) {
      res.setHeader("X-Cache", "REDIS_HIT");
      res.json({ ...cached, _fromRedisCache: true });
      return;
    }

    const data = await fetchGeocode(query, lang);
    CloudRedisCache.set(redisKey, data, 600);
    res.setHeader("X-Cache", "REDIS_MISS");
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to geocode location" });
  }
};

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { lat, lon, name } = req.query;
    if (!lat || !lon) {
      res.status(400).json({ error: "Parameters lat and lon are required" });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const normalizedName = (name as string) || "Hanoi";

    const redisKey = `redis:weather:lat:${latitude.toFixed(4)}:lon:${longitude.toFixed(4)}:name:${normalizedName.toLowerCase().replace(/\s/g, '_')}`;

    const cached = CloudRedisCache.get(redisKey);
    if (cached) {
      res.setHeader("X-Cache", "REDIS_HIT");
      res.json({ ...cached, _fromRedisCache: true });
      return;
    }

    const finalResult = await fetchWeather(latitude, longitude, normalizedName);
    CloudRedisCache.set(redisKey, finalResult, 300);
    res.setHeader("X-Cache", "REDIS_MISS");
    res.json(finalResult);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch weather data" });
  }
};

export const getItinerary = async (req: Request, res: Response) => {
  try {
    const { weatherData, preferences } = req.body;
    if (!weatherData || !preferences) {
      res.status(400).json({ error: "Missing weatherData or preferences" });
      return;
    }

    const { current, daily, coordinates } = weatherData;
    const { language, preferredActivities, transportMode, tempTolerance, uvTolerance } = preferences;

    const currentPrefsKey = `${language}:${(preferredActivities || []).join(',')}:${transportMode}:${tempTolerance}:${uvTolerance}`;
    const redisKey = `redis:itinerary:loc:${coordinates.name.toLowerCase().replace(/\s/g, '_')}:prefs:${currentPrefsKey}`;

    const cached = CloudRedisCache.get(redisKey);
    if (cached) {
      res.setHeader("X-Cache", "REDIS_HIT");
      res.json({ ...cached, _fromRedisCache: true });
      return;
    }

    const langPrompt = language === "vi" ? "Tiếng Việt" : "English";
    const prompt = `...`; // Same prompt as in server.ts (I will use a shortened version here for brevity in the actual file)

    // I should actually keep the full prompt for functional parity.
    const fullPrompt = `
      You are a friendly local tour guide and a meteorological planning assistant.
      Plan a comprehensive personal 1-day travel or activity schedule based on real-time meteorological conditions and personal choices.

      === CURRENT WEATHER in ${coordinates.name} ===
      Temperature: ${current.temperature}°C (Feels like: ${current.apparentTemperature}°C)
      Current status code: ${current.weatherCode}
      Precipitation (Rain): ${current.rain}mm, Showers: ${current.showers}mm
      Wind Speed: ${current.windSpeed} km/h

      === DAILY FORECAST OUTLINES ===
      Max temp: ${daily[0]?.tempMax}°C, Min temp: ${daily[0]?.tempMin}°C
      UV Index Maximum: ${daily[0]?.uvIndexMax}
      Total precipitation today: ${daily[0]?.precipitationSum}mm

      === USER PERSONAL PREFERENCES ===
      Primary selected preferred activity types: ${(preferredActivities || []).join(", ") || "Any standard activities"}
      Transportation mode requested: ${transportMode}
      Temperature preference level: ${tempTolerance} (cold/temperate/hot)
      UV tolerance level: ${uvTolerance} (low/moderate/high)

      === INSTRUCTIONS ===
      1. Create a logical timeline of exactly 3 to 5 activities from morning to evening.
      2. Keep description and reason concise (max 2 sentences each) to keep the response compact and fast.
      3. Match activities directly with the meteorological constraints (e.g. if it is raining, prefer INDOOR activities, cafés, museums, libraries instead of hiking or swimming).
      4. Suggest explicit REAL local landmarks or popular venues in "${coordinates.name}" that relate to the requested activities and current layout of weather.
      5. For each activity, specify the 'activityType' (must be one of these exact lowercase keywords: outdoor, indoor, cafe, shopping, sightseeing, sport).
      6. Provide a short contextual 'reason' justifying why this activity and location is optimized for the user's preferences and current weather.
      7. Formulate everything strictly in ${langPrompt}.
    `;

    let finalPlan: any;
    try {
      const ai = getGeminiClient();
      const response = await generateContentWithFallback(ai, fullPrompt, {
        systemInstruction: `You are an expert meteorological concierge. Respond in a highly formatted JSON matching the requested schema. Suggest real landmarks and popular local spots in the city that match the user's current weather context.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locationName: { type: Type.STRING },
            summary: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                  activityType: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["time", "title", "description", "location", "activityType", "reason"],
              }
            }
          },
          required: ["locationName", "summary", "items"],
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      if (parsedData.items && Array.isArray(parsedData.items)) {
        parsedData.items = parsedData.items.map((item: any) => {
          const queryTerm = `${item.location} ${coordinates.name}`;
          const encodedQuery = encodeURIComponent(queryTerm);
          return {
            id: Math.random().toString(36).substring(2, 11),
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
            ...item
          };
        });
      }

      // Logic for score calculation (same as server.ts)
      let score = 80;
      // ... (I will include the score logic in the file)
      const preferredSet = new Set((preferredActivities || []).map((x: string) => x.toLowerCase()));
      let matchedActivities = 0;
      parsedData.items.forEach((item: any) => {
        if (preferredSet.has(item.activityType.toLowerCase())) matchedActivities++;
      });
      if (parsedData.items.length > 0) score += Math.round((matchedActivities / parsedData.items.length) * 15);

      const precipitation = current?.rain || 0;
      if (precipitation > 0) {
        let indoorFriendly = 0;
        parsedData.items.forEach((item: any) => {
          const type = item.activityType.toLowerCase();
          if (['indoor', 'cafe', 'shopping'].includes(type)) indoorFriendly++;
        });
        if (parsedData.items.length > 0) score += Math.round((indoorFriendly / parsedData.items.length) * 10) - 5;
      } else {
        let pleasantFriendly = 0;
        parsedData.items.forEach((item: any) => {
          const type = item.activityType.toLowerCase();
          if (['outdoor', 'sightseeing', 'sport'].includes(type)) pleasantFriendly++;
        });
        if (parsedData.items.length > 0) score += Math.round((pleasantFriendly / parsedData.items.length) * 8);
      }
      score = Math.max(72, Math.min(99, score));

      finalPlan = {
        id: Math.random().toString(36).substring(2, 11),
        date: daily[0]?.date || new Date().toISOString().split('T')[0],
        locationName: coordinates.name,
        summary: parsedData.summary || "Done planning",
        items: parsedData.items || [],
        transportMode,
        suitabilityScore: score,
        generatedAt: new Date().toISOString()
      };
    } catch (err) {
      finalPlan = generateLocalFallbackItinerary(coordinates, current, daily, preferences);
    }

    CloudRedisCache.set(redisKey, finalPlan, 1800);
    res.setHeader("X-Cache", "REDIS_MISS");
    res.json(finalPlan);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to plan travel routine" });
  }
};

export const analyzeAlerts = async (req: Request, res: Response) => {
  try {
    const { weatherData, preferences } = req.body;
    if (!weatherData || !preferences) {
      res.status(400).json({ error: "Missing weatherData or preferences" });
      return;
    }

    const { current, daily, coordinates } = weatherData;
    const { language, preferredActivities, tempTolerance, uvTolerance } = preferences;

    const currentPrefsKey = `${language}:${(preferredActivities || []).join(',')}:${tempTolerance}:${uvTolerance}`;
    const redisKey = `redis:alerts:loc:${coordinates.name.toLowerCase().replace(/\s/g, '_')}:prefs:${currentPrefsKey}`;

    const cached = CloudRedisCache.get(redisKey);
    if (cached) {
      res.setHeader("X-Cache", "REDIS_HIT");
      res.json({ ...cached, _fromRedisCache: true });
      return;
    }

    const langPrompt = language === "vi" ? "Tiếng Việt" : "English";
    const prompt = `...`; // Simplified here, will use full in file

    const fullPrompt = `
      You are a weather guard radar. Analyze the current conditions and 1-day forecast to find any sudden shifts or severe parameters.
      Generate 1 to 2 personalized alert/notification objects containing a realistic notification based on user behavior and style preferences.

      === WEATHER PARAMETERS ===
      Current Temp: ${current.temperature}°C (Feels like: ${current.apparentTemperature}°C)
      Current rain rate: ${current.rain}mm, wind speed: ${current.windSpeed} km/h
      Max Temp Today: ${daily[0]?.tempMax}°C, Min Temp Today: ${daily[0]?.tempMin}°C
      Max UV Index: ${daily[0]?.uvIndexMax}
      Total precipitation today: ${daily[0]?.precipitationSum}mm

      === USER BEHAVIORS AND TOLERANCE ===
      Activity tags: ${(preferredActivities || []).join(", ") || "General activities"}
      Temp tolerance level: ${tempTolerance}
      UV tolerance level: ${uvTolerance}

      === GENERATION INSTRUCTIONS ===
      Create specific alerts if weather changes. For example:
      - Rain/Precipitation changes or storms.
      - Extremely high UV (UV Index > 6) if the user has Outdoor preferences or Low UV tolerance.
      - Hot/Cold alerts compared to tolerance.
      If there are no severe elements, generate a "Positive Itinerary Alert" telling them about great conditions for their favorite things!
      Ensure severity matches: 'danger' (severe rain/storms, extreme UV), 'warning' (changing drizzle, moderate UV, stronger winds), or 'info' (ideal conditions, light drops).
      Write all outputs strictly in ${langPrompt}.
    `;

    let finalAlertContainer: any;
    try {
      const ai = getGeminiClient();
      const response = await generateContentWithFallback(ai, fullPrompt, {
        systemInstruction: `You are a critical meteorological alert proxy. Respond in a highly formatted JSON list.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  message: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ["title", "message", "severity", "type"]
              }
            }
          },
          required: ["alerts"]
        }
      });

      const parsed = JSON.parse(response.text || '{"alerts": []}');
      const alertItems = (parsed.alerts || []).map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        read: false
      }));
      finalAlertContainer = { alerts: alertItems };
    } catch (err) {
      finalAlertContainer = generateLocalFallbackAlerts(weatherData, preferences);
    }

    CloudRedisCache.set(redisKey, finalAlertContainer, 600);
    res.setHeader("X-Cache", "REDIS_MISS");
    res.json(finalAlertContainer);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate alerts" });
  }
};

export const getRedisStats = (req: Request, res: Response) => {
  res.json(CloudRedisCache.getMetrics());
};

export const clearRedis = (req: Request, res: Response) => {
  CloudRedisCache.clear();
  res.json({ success: true, message: "Cloud Redis cache flushed successfully." });
};
