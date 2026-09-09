import React, { useState } from 'react';
import { Activity, Clock, HelpCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function Header() {
  const [showPitchGuide, setShowPitchGuide] = useState(false);

  return (
    <header style={{ marginBottom: 18 }}>
      <div className="header-container">
        <div className="header-title-area">
          <h1>
            <Activity size={26} color="#2563eb" />
            Delhi NCR Air Quality Forecasting System
          </h1>
          <p>AI-Enhanced Weather–Chemistry Coupled Forecasting | 72-Hour Outlook</p>
        </div>

        <div className="header-meta-area">
          <button
            onClick={() => setShowPitchGuide(!showPitchGuide)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <HelpCircle size={14} />
            Judging Demo Sequence (2–3 min)
            {showPitchGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <div className="badge-demo">
            DEMO MODE
          </div>

          <div className="meta-timestamp">
            <Clock size={14} color="#64748b" />
            <span>Last Updated: 09 Sep 2026, 18:00 IST</span>
          </div>
        </div>
      </div>

      {/* Collapsible Judging Flow Guide */}
      {showPitchGuide && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #bfdbfe',
            borderLeft: '5px solid #2563eb',
            borderRadius: 8,
            padding: '14px 18px',
            marginBottom: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontSize: 12.5,
          }}
        >
          <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={16} color="#2563eb" />
            Quick 2–3 Minute Presentation Pitch Sequence for SIH Judges:
          </div>
          <ol style={{ paddingLeft: 20, color: '#334155', lineHeight: 1.6 }}>
            <li><strong>Open Dashboard:</strong> Highlight the coupled architecture solving Problem Statement SIH26082.</li>
            <li><strong>Current Air Quality:</strong> Show the 4 KPI cards (AQI, PM2.5, PM10, O3) for Delhi.</li>
            <li><strong>NCR Spatial Map:</strong> Point out the 5 sub-region sensor stations coupled with 3km WRF grid.</li>
            <li><strong>Location Interaction:</strong> Click Noida/Ghaziabad to show reactive live calibration across the entire system.</li>
            <li><strong>72-Hour Forecast Chart:</strong> Demonstrate the diurnal cycle curve; toggle between AI-Corrected vs Raw WRF physics baseline.</li>
            <li><strong>Coupled Weather:</strong> Explain how shallow boundary layer (420m) and low winds choke dispersion.</li>
            <li><strong>Atmospheric Inversion Risk:</strong> Click "View Risk Factors" to show thermodynamic stability thresholds.</li>
            <li><strong>Regional Biomass Plume Risk:</strong> Expand trajectory details showing NW upwind fire transit window (8–12h).</li>
            <li><strong>AI Bias Correction:</strong> Emphasize that LightGBM/XGBoost is a post-processor correcting WRF bias, NOT replacing physics.</li>
            <li><strong>WRF-Chem Pipeline:</strong> Walk through the 5-step coupled meteorology-chemistry flow.</li>
            <li><strong>Actionable Alert:</strong> Show how the 12-hour ahead advisory supports proactive public health and municipal traffic curbs.</li>
          </ol>
        </div>
      )}
    </header>
  );
}
