export interface WeatherData {
  current: {
    temperature: number;
    weatherCode: number;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    weatherCode: number[];
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather');
  const data = await res.json();
  
  const nowMs = Date.now();
  let startIndex = 0;
  for (let i = 0; i < data.hourly.time.length; i++) {
    const timeMs = new Date(data.hourly.time[i]).getTime();
    if (timeMs >= nowMs - 3600000) {
      startIndex = i;
      break;
    }
  }

  return {
    current: {
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      feelsLike: data.current.apparent_temperature,
    },
    hourly: {
      time: data.hourly.time.slice(startIndex, startIndex + 24),
      temperature: data.hourly.temperature_2m.slice(startIndex, startIndex + 24),
      weatherCode: data.hourly.weather_code.slice(startIndex, startIndex + 24),
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
    }
  };
}

export function getWeatherIcon(code: number): string {
  // WMO Weather interpretation codes
  if (code === 0) return '☀️'; // Clear sky
  if (code === 1 || code === 2 || code === 3) return '⛅'; // Mainly clear, partly cloudy, and overcast
  if (code === 45 || code === 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 55) return '🌧️'; // Drizzle
  if (code >= 61 && code <= 65) return '🌧️'; // Rain
  if (code >= 71 && code <= 77) return '❄️'; // Snow
  if (code >= 80 && code <= 82) return '🌦️'; // Rain showers
  if (code >= 85 && code <= 86) return '❄️'; // Snow showers
  if (code >= 95) return '⛈️'; // Thunderstorm
  return '☁️';
}

export function formatHour(timeStr: string, lang: 'en' | 'ru' = 'en'): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString(lang === 'ru' ? 'ru-RU' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(timeStr: string, lang: 'en' | 'ru' = 'en'): string {
  const date = new Date(timeStr);
  const formatter = new Intl.DateTimeFormat(lang === 'ru' ? 'ru' : 'en-US', { weekday: 'short' });
  const text = formatter.format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}
