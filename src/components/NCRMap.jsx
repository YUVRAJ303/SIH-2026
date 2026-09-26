import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LOCATIONS, LOCATION_DATA, getAQICategory, AQI_CATEGORIES } from '../data/demoData';
import { Map, Navigation, Wind } from 'lucide-react';

// ---------- Custom Marker Generator with AQI badge ----------
function createCustomMarkerIcon(aqi, isSelected) {
  const cat = getAQICategory(aqi);
  const ringStyle = isSelected
    ? 'transform: scale(1.15); box-shadow: 0 0 0 3px rgba(15,23,42,0.35), 0 2px 8px rgba(0,0,0,0.25);'
    : '';

  return L.divIcon({
    className: 'custom-aqi-pin',
    html: `
      <div style="
        background: ${cat.color};
        color: #ffffff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 6px;
        border-radius: 12px;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
        ${ringStyle}
      ">
        ${aqi}
      </div>
    `,
    iconSize: [42, 24],
    iconAnchor: [21, 12],
  });
}

// Controller to pan map when selected location changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 11, { animate: true });
    }
  }, [center, map]);
  return null;
}

// ---------- Helper: radius (in meters) scaled by AQI severity ----------
function getHeatRadius(aqi) {
  if (aqi > 400) return 9000;
  if (aqi > 300) return 7500;
  if (aqi > 200) return 6000;
  if (aqi > 100) return 4500;
  if (aqi > 50) return 3000;
  return 2000;
}

// ---------- View 1: Station Sensor Map (Real Leaflet Map with Markers) ----------
function StationMap({ selectedLocation, onSelectLocation, centerCoords, selectedLocObj }) {
  return (
    <MapContainer
      center={centerCoords}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapRecenter center={[selectedLocObj.lat, selectedLocObj.lng]} />

      {LOCATIONS.map((loc) => {
        const data = LOCATION_DATA[loc.id];
        const aqi = data ? data.current.aqi : loc.defaultAQI;
        const cat = getAQICategory(aqi);
        const isSelected = loc.id === selectedLocation;

        return (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createCustomMarkerIcon(aqi, isSelected)}
            eventHandlers={{
              click: () => onSelectLocation(loc.id),
            }}
          >
            <Popup>
              <div style={{ padding: 4 }}>
                <strong style={{ fontSize: 13, color: '#0f172a' }}>{loc.name}</strong>
                <div style={{ marginTop: 4, fontSize: 12 }}>
                  AQI: <strong style={{ color: cat.textColor }}>{aqi} ({cat.label})</strong>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  PM2.5: {data.current.pm25} µg/m³ | PM10: {data.current.pm10} µg/m³
                </div>
                <button
                  onClick={() => onSelectLocation(loc.id)}
                  style={{
                    marginTop: 6,
                    width: '100%',
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    padding: '3px 6px',
                    borderRadius: 4,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  Select Sub-region
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

// ---------- View 2: AQI Heatmap Map (Real Leaflet Map with Concentric Circles) ----------
function AQIHeatMap({ selectedLocation, onSelectLocation, centerCoords, selectedLocObj }) {
  return (
    <MapContainer
      center={centerCoords}
      zoom={9.5}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapRecenter center={[selectedLocObj.lat, selectedLocObj.lng]} />

      {LOCATIONS.map((loc) => {
        const data = LOCATION_DATA[loc.id];
        const aqi = data ? data.current.aqi : loc.defaultAQI;
        const cat = getAQICategory(aqi);
        const isSelected = loc.id === selectedLocation;
        const baseRadius = getHeatRadius(aqi);

        return (
          <React.Fragment key={loc.id}>
            {/* Outer soft glow ring - simulates diffusion */}
            <Circle
              center={[loc.lat, loc.lng]}
              radius={baseRadius}
              pathOptions={{
                color: cat.color,
                fillColor: cat.color,
                fillOpacity: 0.12,
                weight: 0,
              }}
            />
            {/* Middle ring */}
            <Circle
              center={[loc.lat, loc.lng]}
              radius={baseRadius * 0.6}
              pathOptions={{
                color: cat.color,
                fillColor: cat.color,
                fillOpacity: 0.22,
                weight: 0,
              }}
            />
            {/* Core hotspot */}
            <Circle
              center={[loc.lat, loc.lng]}
              radius={baseRadius * 0.28}
              eventHandlers={{ click: () => onSelectLocation(loc.id) }}
              pathOptions={{
                color: isSelected ? '#ffffff' : cat.color,
                fillColor: cat.color,
                fillOpacity: 0.55,
                weight: isSelected ? 2 : 0,
              }}
            >
              <Popup>
                <div style={{ padding: 4 }}>
                  <strong style={{ fontSize: 13, color: '#0f172a' }}>{loc.name}</strong>
                  <div style={{ marginTop: 4, fontSize: 12 }}>
                    AQI: <strong style={{ color: cat.textColor }}>{aqi} ({cat.label})</strong>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    PM2.5: {data.current.pm25} µg/m³ | PM10: {data.current.pm10} µg/m³
                  </div>
                </div>
              </Popup>
            </Circle>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}

// ---------- Main Component ----------
export default function NCRMap({ selectedLocation, onSelectLocation }) {
  const [activeView, setActiveView] = useState('station'); // 'station' | 'heatmap'

  const selectedLocObj = LOCATIONS.find((l) => l.id === selectedLocation) || LOCATIONS[0];
  const centerCoords = [28.6139, 77.209]; // Real Delhi centroid (India Gate area)

  return (
    <div className="tech-card" style={{ width: '100%' }}>
      <div className="card-header-row">
        <div>
          <div className="card-title">
            <Map size={18} color="#2563eb" />
            {activeView === 'station'
              ? 'Delhi NCR Spatial Sensor & Forecast Grid'
              : 'Delhi NCR AQI Concentration Heatmap'}
          </div>
          <div className="card-subtitle">
            {activeView === 'station'
              ? 'Live station nodes on real Delhi NCR map, coupled with 3km WRF-Chem grid'
              : 'Pollutant intensity diffusion visualized across real sub-region geography'}
          </div>
        </div>

        {/* Toggle between Station Map and AQI Heatmap */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: 3,
            gap: 2,
          }}
        >
          <button
            onClick={() => setActiveView('station')}
            style={{
              fontSize: 11.5,
              padding: '4px 10px',
              borderRadius: 4,
              border: 'none',
              background: activeView === 'station' ? '#0f172a' : 'transparent',
              color: activeView === 'station' ? '#ffffff' : '#475569',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s ease',
            }}
          >
            <Navigation size={12} />
            Stations
          </button>
          <button
            onClick={() => setActiveView('heatmap')}
            style={{
              fontSize: 11.5,
              padding: '4px 10px',
              borderRadius: 4,
              border: 'none',
              background: activeView === 'heatmap' ? '#0f172a' : 'transparent',
              color: activeView === 'heatmap' ? '#ffffff' : '#475569',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s ease',
            }}
          >
            <Wind size={12} />
            AQI Heatmap
          </button>
        </div>
      </div>

      {/* Full-width single map — switches based on activeView */}
      <div className="map-container" style={{ height: 480 }}>
        {activeView === 'station' ? (
          <StationMap
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            centerCoords={centerCoords}
            selectedLocObj={selectedLocObj}
          />
        ) : (
          <AQIHeatMap
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            centerCoords={centerCoords}
            selectedLocObj={selectedLocObj}
          />
        )}
      </div>

      {/* Map Legend */}
      <div className="map-legend-bar">
        <span style={{ fontWeight: 700, color: '#334155', marginRight: 4 }}>
          AQI Severity Scale:
        </span>
        {AQI_CATEGORIES.map((cat) => (
          <div key={cat.label} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: cat.color }} />
            <span>{cat.label} ({cat.min}–{cat.max})</span>
          </div>
        ))}
      </div>
    </div>
  );
}