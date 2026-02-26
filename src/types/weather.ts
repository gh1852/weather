export type WeatherScene = 'Windy' | 'Rainy' | 'Sunny' | 'Snowy'

export type CityKey = 'beijing' | 'shanghai' | 'shenzhen'

export interface City {
  key: CityKey
  name: string
  latitude: number
  longitude: number
}

export interface OpenMeteoCurrentResponse {
  current?: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
  }
}

export interface WeatherData {
  city: City
  temperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  scene: WeatherScene
  updatedAt: string
}
