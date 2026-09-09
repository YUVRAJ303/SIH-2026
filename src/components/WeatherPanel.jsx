import React from 'react';
import { Cloud, Thermometer, Wind, Compass, Droplet, Layers, Info } from 'lucide-react';

export default function WeatherPanel({ weatherData }) {
  return (
    <div className="tech-card">
      <div className="card-header-row">
        <div className="card-title">
          <Cloud size={16} color="#2563eb" />
          Coupled Weather Parameters
        </div>
        <span className="card-subtitle">WRF Boundary Layer Feed</span>
      </div>

      <div className="weather-grid">
        {/* Temperature */}
        <div className="weather-metric">
          <div className="weather-metric-label">
            <Thermometer size={13} color="#ea580c" />
            2m Temperature
          </div>
          <div className="weather-metric-val mono">
            {weatherData.temp}°C
          </div>
        </div>

        {/* Wind Speed */}
        <div className="weather-metric">
          <div className="weather-metric-label">
            <Wind size={13} color="#0284c7" />
            Wind Speed
          </div>
          <div className="weather-metric-val mono">
            {weatherData.windSpeed} <span className="weather-metric-unit">m/s</span>
          </div>
        </div>

        {/* Wind Direction */}
        <div className="weather-metric">
          <div className="weather-metric-label">
            <Compass size={13} color="#0d9488" />
            Wind Direction
          </div>
          <div className="weather-metric-val mono">
            {weatherData.windDirection} <span className="weather-metric-unit">({weatherData.windDegrees}°)</span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="weather-metric">
          <div className="weather-metric-label">
            <Droplet size={13} color="#3b82f6" />
            Relative Humidity
          </div>
          <div className="weather-metric-val mono">
            {weatherData.humidity}%
          </div>
        </div>

        {/* Planetary Boundary Layer Height */}
        <div className="weather-metric" style={{ gridColumn: 'span 2', background: '#eff6ff', borderColor: '#bfdbfe' }}>
          <div className="weather-metric-label" style={{ color: '#1d4ed8' }}>
            <Layers size={14} color="#1d4ed8" />
            Planetary Boundary Layer (PBL) Height
          </div>
          <div className="weather-metric-val mono" style={{ color: '#1e40af', fontSize: 20 }}>
            {weatherData.pblHeight} <span className="weather-metric-unit" style={{ color: '#2563eb' }}>meters (Shallow)</span>
          </div>
        </div>
      </div>

      <div className="weather-note">
        <Info size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} color="#2563eb" />
        Weather conditions strongly influence pollutant dispersion and accumulation.
      </div>
    </div>
  );
}
