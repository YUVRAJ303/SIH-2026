import React from 'react';
import { Wind, Shield, Droplets, Sparkles, MapPin } from 'lucide-react';
import { getAQICategory, LOCATIONS } from '../data/demoData';

export default function AQICards({ currentData, selectedLocation, onSelectLocation }) {
  const aqiCat = getAQICategory(currentData.aqi);

  return (
    <div>
      {/* Location Selector Bar */}
      <div className="location-selector-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={18} color="#2563eb" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
            SELECT NCR MONITORING SUB-REGION:
          </span>
        </div>
        <div className="location-pills">
          {LOCATIONS.map((loc) => {
            const isActive = loc.id === selectedLocation;
            return (
              <button
                key={loc.id}
                className={`location-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectLocation(loc.id)}
              >
                {loc.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="kpi-cards-grid">
        {/* Card 1: AQI */}
        <div className="kpi-card" style={{ borderTop: `4px solid ${aqiCat.color}` }}>
          <div className="kpi-top">
            <span className="kpi-label">Air Quality Index</span>
            <div className="kpi-icon" style={{ backgroundColor: aqiCat.bgLight, color: aqiCat.color }}>
              <Shield size={18} />
            </div>
          </div>
          <div className="kpi-val-container">
            <span className="kpi-val mono" style={{ color: aqiCat.textColor }}>
              {currentData.aqi}
            </span>
            <span className="kpi-unit">AQI (IN)</span>
          </div>
          <div
            className="kpi-status-badge"
            style={{
              backgroundColor: aqiCat.bgLight,
              color: aqiCat.textColor,
              border: `1px solid ${aqiCat.borderColor}`,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: aqiCat.color,
                display: 'inline-block',
              }}
            />
            {currentData.category || aqiCat.label}
          </div>
        </div>

        {/* Card 2: PM2.5 */}
        <div className="kpi-card" style={{ borderTop: '4px solid #f97316' }}>
          <div className="kpi-top">
            <span className="kpi-label">Fine Particulate (PM2.5)</span>
            <div className="kpi-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
              <Wind size={18} />
            </div>
          </div>
          <div className="kpi-val-container">
            <span className="kpi-val mono" style={{ color: '#0f172a' }}>
              {currentData.pm25}
            </span>
            <span className="kpi-unit">µg/m³</span>
          </div>
          <div className="kpi-status-badge" style={{ backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
            Primary Winter Driver
          </div>
        </div>

        {/* Card 3: PM10 */}
        <div className="kpi-card" style={{ borderTop: '4px solid #eab308' }}>
          <div className="kpi-top">
            <span className="kpi-label">Coarse Particulate (PM10)</span>
            <div className="kpi-icon" style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>
              <Droplets size={18} />
            </div>
          </div>
          <div className="kpi-val-container">
            <span className="kpi-val mono" style={{ color: '#0f172a' }}>
              {currentData.pm10}
            </span>
            <span className="kpi-unit">µg/m³</span>
          </div>
          <div className="kpi-status-badge" style={{ backgroundColor: '#fefce8', color: '#a16207', border: '1px solid #fef08a' }}>
            Dust &amp; Mechanical Load
          </div>
        </div>

        {/* Card 4: O3 */}
        <div className="kpi-card" style={{ borderTop: '4px solid #0284c7' }}>
          <div className="kpi-top">
            <span className="kpi-label">Surface Ozone (O3)</span>
            <div className="kpi-icon" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
              <Sparkles size={18} />
            </div>
          </div>
          <div className="kpi-val-container">
            <span className="kpi-val mono" style={{ color: '#0f172a' }}>
              {currentData.o3}
            </span>
            <span className="kpi-unit">µg/m³</span>
          </div>
          <div className="kpi-status-badge" style={{ backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>
            Photochemical Secondary
          </div>
        </div>
      </div>
    </div>
  );
}
