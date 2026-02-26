import { useEffect, useMemo, useState } from 'react'
import { CITIES } from './constants/cities'
import { fetchCityWeather } from './lib/weather'
import type { CityKey, WeatherData, WeatherScene } from './types/weather'
import './App.css'

const REFRESH_INTERVAL_MS = 60_000

function formatUpdatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

function App() {
  const [selectedCity, setSelectedCity] = useState<CityKey>('beijing')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeCity = useMemo(
    () => CITIES.find((city) => city.key === selectedCity) ?? CITIES[0],
    [selectedCity],
  )

  useEffect(() => {
    let cancelled = false

    const loadWeather = async () => {
      setLoading(true)
      setError(null)

      try {
        const nextWeather = await fetchCityWeather(activeCity)
        if (!cancelled) {
          setWeather(nextWeather)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load weather data.')
          setWeather(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadWeather()

    const timer = window.setInterval(() => {
      loadWeather()
    }, REFRESH_INTERVAL_MS)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [activeCity])

  const scene: WeatherScene = weather?.scene ?? 'Sunny'

  return (
    <main className={`weather-page ${scene.toLowerCase()}`}>
      <div className="ambient-layer" aria-hidden="true">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
      </div>

      <section className="weather-card" aria-live="polite">
        <header className="card-header">
          <p className="eyebrow">Live Weather</p>
          <h1>{activeCity.name}</h1>
          {weather && <p className="scene-tag">{weather.scene}</p>}
        </header>

        <div className="city-switch" role="tablist" aria-label="Choose city">
          {CITIES.map((city) => (
            <button
              key={city.key}
              type="button"
              role="tab"
              aria-selected={city.key === selectedCity}
              className={city.key === selectedCity ? 'city-btn active' : 'city-btn'}
              onClick={() => setSelectedCity(city.key)}
            >
              {city.name}
            </button>
          ))}
        </div>

        {loading && <p className="state-text">Loading weather data...</p>}

        {!loading && error && (
          <div className="state-box error" role="alert">
            <p>{error}</p>
          </div>
        )}

        {!loading && weather && !error && (
          <>
            <div className="metrics-grid">
              <article className="metric-item">
                <p className="metric-label">Temperature</p>
                <p className="metric-value">{weather.temperature.toFixed(1)}°C</p>
              </article>
              <article className="metric-item">
                <p className="metric-label">Humidity</p>
                <p className="metric-value">{weather.humidity}%</p>
              </article>
              <article className="metric-item">
                <p className="metric-label">Wind Speed</p>
                <p className="metric-value">{weather.windSpeed.toFixed(1)} km/h</p>
              </article>
            </div>
            <p className="updated-at">Updated: {formatUpdatedAt(weather.updatedAt)}</p>
          </>
        )}
      </section>
    </main>
  )
}

export default App
