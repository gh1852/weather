import { useEffect, useMemo, useState } from 'react'
import { CITIES } from './constants/cities'
import { fetchCityWeather } from './lib/weather'
import type { CityKey, WeatherData, WeatherScene } from './types/weather'
import './App.css'

const REFRESH_INTERVAL_MS = 60_000

const SCENE_LABELS: Record<WeatherScene, string> = {
  Sunny: '晴天',
  Rainy: '雨天',
  Windy: '大风',
  Snowy: '雪天',
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('zh-CN')
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
          setError(err instanceof Error ? err.message : '天气数据加载失败。')
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
        <span className="particle p5" />
        <span className="particle p6" />
        <span className="particle p7" />
        <span className="particle p8" />
      </div>

      <section className="weather-card" aria-live="polite">
        <header className="card-header">
          <p className="eyebrow">实时天气</p>
          <h1>{activeCity.name}</h1>
          {weather && <p className="scene-tag">{SCENE_LABELS[weather.scene]}</p>}
        </header>

        <div className="city-switch" role="tablist" aria-label="选择城市">
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

        {loading && <p className="state-text">正在加载天气数据...</p>}

        {!loading && error && (
          <div className="state-box error" role="alert">
            <p>{error}</p>
          </div>
        )}

        {!loading && weather && !error && (
          <>
            <div className="metrics-grid">
              <article className="metric-item">
                <p className="metric-label">温度</p>
                <p className="metric-value">{weather.temperature.toFixed(1)}°C</p>
              </article>
              <article className="metric-item">
                <p className="metric-label">湿度</p>
                <p className="metric-value">{weather.humidity}%</p>
              </article>
              <article className="metric-item">
                <p className="metric-label">风速</p>
                <p className="metric-value">{weather.windSpeed.toFixed(1)} km/h</p>
              </article>
            </div>
            <p className="updated-at">更新时间：{formatUpdatedAt(weather.updatedAt)}</p>
          </>
        )}
      </section>
    </main>
  )
}

export default App
