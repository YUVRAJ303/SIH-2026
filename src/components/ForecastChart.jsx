import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { LineChart as ChartIcon, Eye } from 'lucide-react';

const POLLUTANT_CONFIG = {
  aqi: {
    label: 'AQI',
    unit: 'Index',
    colorMain: '#ea580c',
    colorWrf: '#94a3b8',
    keyMain: 'aqi',
    keyWrf: 'rawWrfAqi',
    nameMain: 'AI-Corrected Forecast (AQI)',
    nameWrf: 'Raw WRF-Chem Physics (AQI)',
  },
  pm25: {
    label: 'PM2.5',
    unit: 'µg/m³',
    colorMain: '#dc2626',
    colorWrf: '#94a3b8',
    keyMain: 'pm25',
    keyWrf: 'rawWrfPm25',
    nameMain: 'AI-Corrected PM2.5',
    nameWrf: 'Raw WRF-Chem PM2.5',
  },
  pm10: {
    label: 'PM10',
    unit: 'µg/m³',
    colorMain: '#d97706',
    colorWrf: '#94a3b8',
    keyMain: 'pm10',
    keyWrf: null,
    nameMain: 'AI-Downscaled PM10',
    nameWrf: null,
  },
  o3: {
    label: 'O3',
    unit: 'µg/m³',
    colorMain: '#0284c7',
    colorWrf: null,
    keyMain: 'o3',
    keyWrf: null,
    nameMain: 'Photochemical O3 Forecast',
    nameWrf: null,
  },
};

export default function ForecastChart({ forecastPoints, locationName }) {
  const [activePollutant, setActivePollutant] = useState('aqi');
  const [activeRange, setActiveRange] = useState(72); // 24, 48, 72
  const [showWrfComparison, setShowWrfComparison] = useState(true);

  const currentCfg = POLLUTANT_CONFIG[activePollutant];
  const displayedData = forecastPoints.slice(0, activeRange + 1);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pt = payload[0].payload;
      return (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: 12.5,
          }}
        >
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
            Timeline: {pt.fullDateStr}
          </div>
          {payload.map((item, idx) => (
            <div key={idx} style={{ color: item.color, fontWeight: 600, marginBottom: 3 }}>
              {item.name}: <span className="mono">{item.value}</span> {currentCfg.unit}
            </div>
          ))}
          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 6, paddingTop: 6, color: '#64748b', fontSize: 11 }}>
            PBL: {pt.pblHeight}m | Wind: {pt.windSpeed} m/s
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="tech-card" style={{ marginBottom: 20 }}>
      <div className="card-header-row">
        <div>
          <div className="card-title">
            <ChartIcon size={18} color="#2563eb" />
            72-Hour Air Quality Forecast
          </div>
          <div className="card-subtitle">
            Sub-daily coupled trajectory &amp; machine learning residual downscaling • {locationName}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {currentCfg.keyWrf && (
            <button
              onClick={() => setShowWrfComparison(!showWrfComparison)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 5,
                border: '1px solid #cbd5e1',
                background: showWrfComparison ? '#f1f5f9' : '#ffffff',
                cursor: 'pointer',
                color: '#334155',
                fontWeight: 600,
              }}
            >
              <Eye size={13} />
              {showWrfComparison ? 'Comparing with Raw WRF' : 'Show Raw WRF'}
            </button>
          )}
          <span className="badge-demo" style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}>
            Forecast Outlook
          </span>
        </div>
      </div>

      {/* Controls Bar: Pollutants & Time Range */}
      <div className="chart-controls-bar">
        {/* Pollutant Tabs */}
        <div className="chart-tabs">
          {Object.keys(POLLUTANT_CONFIG).map((polKey) => (
            <button
              key={polKey}
              className={`chart-tab-btn ${activePollutant === polKey ? 'active' : ''}`}
              onClick={() => setActivePollutant(polKey)}
            >
              {POLLUTANT_CONFIG[polKey].label}
            </button>
          ))}
        </div>

        {/* Range Buttons: 24h, 48h, 72h */}
        <div className="range-tabs">
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, alignSelf: 'center', marginRight: 4 }}>
            Window:
          </span>
          {[24, 48, 72].map((hrs) => (
            <button
              key={hrs}
              className={`range-btn ${activeRange === hrs ? 'active' : ''}`}
              onClick={() => setActiveRange(hrs)}
            >
              {hrs}H
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div style={{ width: '100%', height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayedData}
            margin={{ top: 12, right: 20, left: -5, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11.5}
              tickLine={false}
              interval={activeRange === 72 ? 5 : activeRange === 48 ? 3 : 1}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11.5}
              tickLine={false}
              axisLine={false}
              unit={` ${currentCfg.unit}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
            />

            {/* Reference lines for key 24h, 48h marks */}
            <ReferenceLine x="+24h" stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '24h', fill: '#94a3b8', fontSize: 11 }} />
            {activeRange >= 48 && (
              <ReferenceLine x="+48h" stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '48h', fill: '#94a3b8', fontSize: 11 }} />
            )}
            {activeRange === 72 && (
              <ReferenceLine x="+72h" stroke="#94a3b8" strokeDasharray="4 4" label={{ value: '72h', fill: '#94a3b8', fontSize: 11 }} />
            )}

            {/* Raw WRF-Chem (Physics Baseline) */}
            {currentCfg.keyWrf && showWrfComparison && (
              <Line
                type="monotone"
                dataKey={currentCfg.keyWrf}
                name={currentCfg.nameWrf}
                stroke={currentCfg.colorWrf}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}

            {/* AI-Corrected Forecast Line */}
            <Line
              type="monotone"
              dataKey={currentCfg.keyMain}
              name={currentCfg.nameMain}
              stroke={currentCfg.colorMain}
              strokeWidth={2.8}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: currentCfg.colorMain }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="forecast-disclaimer">
        * Simulated/Replay demonstration data for SIH26082 prototype. Values represent coupled model forecast trajectory, not real-time physical observations.
      </div>
    </div>
  );
}
