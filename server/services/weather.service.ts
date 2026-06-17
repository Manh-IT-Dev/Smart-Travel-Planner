export async function fetchGeocode(query: string, lang: string) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${lang}&format=json`;
  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error(`Geocoding server responded with code ${response.status}`);
  }
  return await response.json();
}

export async function fetchWeather(lat: number, lon: number, name: string) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=auto`;
  const response = await fetch(weatherUrl);
  if (!response.ok) {
    throw new Error(`Open-Meteo responded with status ${response.status}`);
  }

  const data = await response.json();
  return {
    coordinates: {
      latitude: lat,
      longitude: lon,
      name,
    },
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      relativeHumidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      rain: data.current.rain,
      showers: data.current.showers,
      snowfall: data.current.snowfall,
    },
    daily: data.daily.time.map((time: string, idx: number) => ({
      date: time,
      weatherCode: data.daily.weather_code[idx],
      tempMin: data.daily.temperature_2m_min[idx],
      tempMax: data.daily.temperature_2m_max[idx],
      precipitationSum: data.daily.precipitation_sum[idx],
      uvIndexMax: data.daily.uv_index_max[idx],
    })),
    hourly: data.hourly.time.map((time: string, idx: number) => ({
      time,
      temperature: data.hourly.temperature_2m[idx],
      weatherCode: data.hourly.weather_code[idx],
    })),
    fetchedAt: new Date().toISOString()
  };
}
