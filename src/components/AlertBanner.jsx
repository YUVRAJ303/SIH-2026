import React from 'react';
import { AlertTriangle, Wind, Layers, CloudRain, Flame } from 'lucide-react';

export default function AlertBanner({ locationName, weatherData, inversionData, plumeData }) {
  const pbl = weatherData ? `${weatherData.pblHeight}m` : '< 450m';
  const wind = weatherData ? `${weatherData.windSpeed} m/s` : '< 2.0 m/s';
  const stability = inversionData ? inversionData.stability : 'HIGH';
  const plumeRisk = plumeData ? plumeData.risk : 'MODERATE';

  return (
    <div className="alert-banner" role="alert">
      <div className="alert-icon-box">
        <AlertTriangle size={24} />
      </div>
      <div className="alert-content">
        <div className="alert-heading">
          <span>HIGH POLLUTION RISK EXPECTED IN NEXT 12 HOURS</span>
          {locationName && (
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#c2410c' }}>
              &bull; Sub-region Focus: {locationName}
            </span>
          )}
        </div>
        <div className="alert-body">
          <div style={{ marginBottom: 4 }}>
            <strong>Coupled atmospheric &amp; regional transport drivers:</strong>
          </div>
          <div className="alert-drivers">
            <span className="driver-pill">
              <Layers size={12} style={{ display: 'inline', marginRight: 4 }} />
              Shallow PBL ({pbl} Boundary Cap)
            </span>
            <span className="driver-pill">
              <Wind size={12} style={{ display: 'inline', marginRight: 4 }} />
              Weak Stagnant Winds ({wind})
            </span>
            <span className="driver-pill">
              <CloudRain size={12} style={{ display: 'inline', marginRight: 4 }} />
              Stability: {stability}
            </span>
            <span className="driver-pill">
              <Flame size={12} style={{ display: 'inline', marginRight: 4 }} />
              Biomass Plume: {plumeRisk} (NW Drift)
            </span>
          </div>
          <div className="alert-recommendation">
            Recommendation: Consider limiting prolonged outdoor exposure during peak-risk periods (night and early morning).
          </div>
        </div>
      </div>
    </div>
  );
}
