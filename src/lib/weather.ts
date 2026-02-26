import type {
  City,
  OpenMeteoCurrentResponse,
  WeatherData,
  WeatherScene,
} from '../types/weather'

const ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

export function mapWeatherCodeToScene(code: number): WeatherScene {
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return 'Snowy'
  }

  if (
    code === 51 ||
    code === 53 ||
    code === 55 ||
    code === 56 ||
    code === 57 ||
    code === 61 ||
    code === 63 ||
    code === 65 ||
    code === 66 ||
    code === 67 ||
    code === 80 ||
    code === 81 ||
    code === 82 ||
    code === 95 ||
    code === 96 ||
    code === 99
  ) {
    return 'Rainy'
  }

  if (code === 0 || code === 1) {
    return 'Sunny'
  }

  return 'Windy'
}

export async function fetchCityWeather(city: City): Promise<WeatherData> {
  const query = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto',
  })

  let response: Response

  try {
    response = await fetch(`${ENDPOINT}?${query.toString()}`)
  } catch {
    throw new Error('Network error: unable to reach weather service.')
  }

  if (!response.ok) {
    throw new Error(`Weather service unavailable (HTTP ${response.status}).`)
  }

  let payload: OpenMeteoCurrentResponse

  try {
    payload = (await response.json()) as OpenMeteoCurrentResponse
  } catch {
    throw new Error('Invalid weather response format.')
  }

  const current = payload.current
  if (!current) {
    throw new Error('Weather data is currently unavailable.')
  }

  return {
    city,
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    scene: mapWeatherCodeToScene(current.weather_code),
    updatedAt: current.time,
  }
}
