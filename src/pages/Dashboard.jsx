import React, { useState, useTransition } from 'react';
import Header from '../components/Header';
import AlertBanner from '../components/AlertBanner';
import AQICards from '../components/AQICards';
import WeatherPanel from '../components/WeatherPanel';
import ForecastChart from '../components/ForecastChart';
import NCRMap from '../components/NCRMap';
import InversionRisk from '../components/InversionRisk';
import PlumeRisk from '../components/PlumeRisk';
import AICorrection from '../components/AICorrection';
import WRFModelPipeline from '../components/WRFModelPipeline';
import ModelFlowSummary from '../components/ModelFlowSummary';
import { LOCATIONS, LOCATION_DATA, generate72hForecast } from '../data/demoData';

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState('delhi');
  const [isPending, startTransition] = useTransition();

  const handleLocationChange = (locId) => {
    startTransition(() => {
      setSelectedLocation(locId);
    });
  };

  const activeData = LOCATION_DATA[selectedLocation] || LOCATION_DATA.delhi;
  const forecastPoints = generate72hForecast(selectedLocation);

  return (
    <div style={{ position: 'relative' }}>
      {/* Subtle indicator when transitioning */}
      {isPending && (
        <div
          style={{
            position: 'fixed',
            top: 10,
            right: 20,
            background: '#0f172a',
            color: '#fff',
            fontSize: 11,
            padding: '4px 10px',
            borderRadius: 20,
            zIndex: 9999,
            opacity: 0.9,
          }}
        >
          Calibrating sub-region...
        </div>
      )}

      {/* Header */}
      <Header
        selectedLocation={selectedLocation}
        onSelectLocation={handleLocationChange}
        locations={LOCATIONS}
      />

      {/* Section 9: Actionable Alert Banner */}
      <AlertBanner
        locationName={activeData.name}
        weatherData={activeData.weather}
        inversionData={activeData.inversion}
        plumeData={activeData.plume}
      />

      {/* Section 1: Current AQI & Pollutant KPIs (with Location Selector) */}
      <AQICards
        currentData={activeData.current}
        selectedLocation={selectedLocation}
        onSelectLocation={handleLocationChange}
      />

      {/* Section 4: Delhi NCR Spatial Map (full width, own toggleable card) */}
      <NCRMap
        selectedLocation={selectedLocation}
        onSelectLocation={handleLocationChange}
      />

      {/* Section 2 & 3: 72h Forecast Chart + Weather Panel side by side */}
      <div className="grid-top-row">
        <ForecastChart
          forecastPoints={forecastPoints}
          locationName={activeData.name}
        />
        <WeatherPanel weatherData={activeData.weather} />
      </div>

      {/* Middle Row: Inversion Intelligence, Plume Intelligence, AI Correction */}
      <div className="grid-intel-row">
        {/* Section 5: Atmospheric Inversion Intelligence */}
        <InversionRisk inversionData={activeData.inversion} />

        {/* Section 6: Regional Biomass-Burning Plume Risk */}
        <PlumeRisk plumeData={activeData.plume} />

        {/* Section 7: AI Forecast Enhancement */}
        <AICorrection aiData={activeData.aiCorrection} />
      </div>

      {/* Section 8: WRF-Chem Coupled Simulation Pipeline */}
      <WRFModelPipeline />

      {/* Section 10: Model Flow Summary */}
      <ModelFlowSummary />
    </div>
  );
}