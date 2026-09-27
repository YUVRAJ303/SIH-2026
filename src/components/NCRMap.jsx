import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { fetchAirQualityByCoords } from '../api';
import { LOCATIONS, LOCATION_DATA, getAQICategory, AQI_CATEGORIES } from '../data/demoData';
import { Map, Navigation, Wind, LocateFixed } from 'lucide-react';

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

function createUserMarkerIcon() {
  return L.divIcon({
    className: 'user-pin',
    html: `
      <div style="
        background: #3b82f6;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function DynamicMarker({ pinData }) {
  const map = useMap();
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    if (pinData) {
      if (pinData.autoPan) {
        map.flyTo(pinData.coords, 12, { animate: true, duration: 1.5 });
      }
      setAqi(null); // Reset when new location clicked
      fetchAirQualityByCoords(pinData.coords[0], pinData.coords[1]).then(data => {
        if (data && data.current) {
          setAqi(data.current.us_aqi);
        }
      });
    }
  }, [pinData, map]);

  if (!pinData) return null;

  return (
    <Marker position={pinData.coords} icon={createUserMarkerIcon()}>
      <Popup>
        <div style={{ padding: 4, fontWeight: 'bold' }}>
          {pinData.label}
          {aqi !== null ? (
            <div style={{marginTop: 4, color: '#3b82f6', fontSize: 13}}>Current AQI: {aqi}</div>
          ) : (
             <div style={{marginTop: 4, color: '#64748b', fontSize: 12}}>Fetching AQI...</div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

// ---------- View 1: Station Sensor Map (Real Leaflet Map with Markers) ----------
function StationMap({ selectedLocation, onSelectLocation, centerCoords, selectedLocObj, dynamicPin, onMapClick }) {
  return (
    <MapContainer
      center={centerCoords}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapRecenter center={[selectedLocObj.lat, selectedLocObj.lng]} />
      <DynamicMarker pinData={dynamicPin} />
      <MapClickHandler onMapClick={onMapClick} />

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
function AQIHeatMap({ selectedLocation, onSelectLocation, centerCoords, selectedLocObj, dynamicPin, onMapClick }) {
  return (
    <MapContainer
      center={centerCoords}
      zoom={9.5}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapRecenter center={[selectedLocObj.lat, selectedLocObj.lng]} />
      <DynamicMarker pinData={dynamicPin} />
      <MapClickHandler onMapClick={onMapClick} />

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
  const [dynamicPin, setDynamicPin] = useState(null);

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDynamicPin({
          coords: [position.coords.latitude, position.coords.longitude],
          label: 'You are here',
          autoPan: true
        });
      }, (err) => {
        alert('Could not fetch your location. Please check browser permissions.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleMapClick = (coords) => {
    setDynamicPin({
      coords,
      label: 'Clicked Location',
      autoPan: false
    });
  };

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
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            onClick={handleLocateMe}
            style={{
              fontSize: 11.5,
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#3b82f6',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease',
            }}
          >
            <LocateFixed size={12} />
            Locate Me
          </button>

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
      </div>

      {/* Full-width single map — switches based on activeView */}
      <div className="map-container" style={{ height: 480 }}>
        {activeView === 'station' ? (
          <StationMap
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            centerCoords={centerCoords}
            selectedLocObj={selectedLocObj}
            dynamicPin={dynamicPin}
            onMapClick={handleMapClick}
          />
        ) : (
          <AQIHeatMap
            selectedLocation={selectedLocation}
            onSelectLocation={onSelectLocation}
            centerCoords={centerCoords}
            selectedLocObj={selectedLocObj}
            dynamicPin={dynamicPin}
            onMapClick={handleMapClick}
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