import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LOCATIONS, LOCATION_DATA, getAQICategory, AQI_CATEGORIES } from '../data/demoData';
import { Map, Layers, Navigation, Wind } from 'lucide-react';

// ---------- Custom Marker Generator with AQI badge ----------
function createCustomMarkerIcon(aqi, isSelected) {
  const cat = getAQICategory(aqi);
  const ringStyle = isSelected ? 'ring: 3px solid #0f172a; transform: scale(1.15);' : '';

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
      map.setView(center, 10, { animate: true });
    }
  }, [center, map]);
  return null;
}

// ---------- Helper: radius (in meters) scaled by AQI severity ----------
function getHeatRadius(aqi) {
  // Higher AQI => larger diffusion radius
  if (aqi > 400) return 9000;
  if (aqi > 300) return 7500;
  if (aqi > 200) return 6000;
  if (aqi > 100) return 4500;
  if (aqi > 50) return 3000;
  return 2000;
}

// ---------- Right Panel: Pseudo AQI Heatmap Map ----------
function AQIHeatMap({ selectedLocation, onSelectLocation }) {
  const selectedLocObj = LOCATIONS.find((l) => l.id === selectedLocation) || LOCATIONS[0];
  const centerCoords = [28.58, 77.26];

  return (
    <MapContainer
      center={centerCoords}
      zoom={9.3}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
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
  const [mapError, setMapError] = useState(false);
  const [useFallbackView, setUseFallbackView] = useState(false);

  const selectedLocObj = LOCATIONS.find((l) => l.id === selectedLocation) || LOCATIONS[0];
  const centerCoords = [28.58, 77.26]; // NCR centroid

  return (
    <div className="tech-card">
      <div className="card-header-row">
        <div>
          <div className="card-title">
            <Map size={18} color="#2563eb" />
            Delhi NCR Spatial Sensor &amp; Forecast Grid
          </div>
          <div className="card-subtitle">
            Station nodes coupled with 3km WRF-Chem resolution grid
          </div>
        </div>

        <button
          onClick={() => setUseFallbackView(!useFallbackView)}
          style={{
            fontSize: 11.5,
            padding: '3px 8px',
            borderRadius: 4,
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#475569',
            fontWeight: 600,
          }}
        >
          {useFallbackView ? 'Switch to Carto Tiles' : 'Vector Grid View'}
        </button>
      </div>

      {/* ---------- Dual Map Grid: Station Map (left) + AQI Heatmap (right) ---------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
        className="dual-map-grid"
      >
        {/* LEFT: Station Sensor Map */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
            <Navigation size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Station Nodes
          </div>
          <div className="map-container">
            {useFallbackView || mapError ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#f8fafc',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
                >
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <ellipse cx="50%" cy="50%" rx="35%" ry="40%" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4" />
                  <text x="52%" y="18%" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">WRF-Chem Domain d03 (3km)</text>
                  <line x1="20%" y1="20%" x2="45%" y2="45%" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow)" strokeDasharray="4 2" />
                  <text x="18%" y="16%" fill="#ef4444" fontSize="11" fontWeight="bold">NW Regional Plume Inflow</text>
                </svg>

                <div style={{ position: 'relative', width: '85%', height: '80%' }}>
                  {LOCATIONS.map((loc) => {
                    const data = LOCATION_DATA[loc.id];
                    const cat = getAQICategory(data.current.aqi);
                    const isSelected = loc.id === selectedLocation;

                    const posMap = {
                      delhi: { top: '44%', left: '46%' },
                      noida: { top: '56%', left: '68%' },
                      ghaziabad: { top: '32%', left: '76%' },
                      gurugram: { top: '68%', left: '26%' },
                      faridabad: { top: '76%', left: '56%' },
                    };
                    const pos = posMap[loc.id] || { top: '50%', left: '50%' };

                    return (
                      <div
                        key={loc.id}
                        onClick={() => onSelectLocation(loc.id)}
                        style={{
                          position: 'absolute',
                          top: pos.top,
                          left: pos.left,
                          transform: 'translate(-50%, -50%)',
                          cursor: 'pointer',
                          zIndex: isSelected ? 10 : 2,
                        }}
                      >
                        <div
                          style={{
                            background: '#ffffff',
                            border: `2px solid ${isSelected ? '#0f172a' : cat.color}`,
                            boxShadow: isSelected
                              ? '0 0 0 3px rgba(15, 23, 42, 0.2), 0 4px 10px rgba(0,0,0,0.15)'
                              : '0 2px 6px rgba(0,0,0,0.08)',
                            borderRadius: 8,
                            padding: '4px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>
                            {loc.name.split(' ')[0]}
                          </span>
                          <span
                            className="mono"
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              color: cat.textColor,
                              background: cat.bgLight,
                              padding: '1px 6px',
                              borderRadius: 4,
                              marginTop: 2,
                            }}
                          >
                            {data.current.aqi} AQI
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <MapContainer
                center={centerCoords}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  subdomains="abcd"
                  maxZoom={19}
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
            )}
          </div>
        </div>

        {/* RIGHT: AQI Heatmap Panel */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
            <Wind size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            AQI Concentration Heatmap
          </div>
          <div className="map-container">
            <AQIHeatMap
              selectedLocation={selectedLocation}
              onSelectLocation={onSelectLocation}
            />
          </div>
        </div>
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