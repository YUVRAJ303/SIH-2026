import React, { useState } from 'react';
import { Flame, Wind, ArrowRight, ChevronDown, ChevronUp, AlertCircle, Compass } from 'lucide-react';

export default function PlumeRisk({ plumeData }) {
  const [expanded, setExpanded] = useState(false);

  const getRiskBadgeColor = (risk) => {
    if (risk === 'HIGH') return { bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' };
    if (risk.includes('MODERATE')) return { bg: '#fffbeb', text: '#b45309', border: '#fde68a' };
    return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
  };

  const badgeStyle = getRiskBadgeColor(plumeData.risk);

  return (
    <div className="tech-card">
      <div className="card-header-row">
        <div>
          <div className="card-title">
            <Flame size={17} color="#ea580c" />
            Regional Biomass-Burning Plume Risk
          </div>
          <div className="card-subtitle">Upwind crop residue &amp; fire transport</div>
        </div>
        <span
          className="kpi-status-badge"
          style={{
            backgroundColor: badgeStyle.bg,
            color: badgeStyle.text,
            border: `1px solid ${badgeStyle.border}`,
          }}
        >
          {plumeData.risk}
        </span>
      </div>

      {/* Visual Flow: Fire Activity -> Wind Transport -> NCR Impact */}
      <div className="plume-flow">
        <div className="flow-step">
          <div className="flow-step-label">Upwind Fire</div>
          <div className="flow-step-val mono" style={{ color: '#ea580c' }}>
            {plumeData.upwindFireCount} clusters
          </div>
        </div>
        <div className="flow-arrow">&rarr;</div>
        <div className="flow-step">
          <div className="flow-step-label">Transport</div>
          <div className="flow-step-val mono" style={{ color: '#0284c7' }}>
            {plumeData.transportWindow}
          </div>
        </div>
        <div className="flow-arrow">&rarr;</div>
        <div className="flow-step">
          <div className="flow-step-label">NCR Impact</div>
          <div className="flow-step-val" style={{ color: badgeStyle.text }}>
            {plumeData.potentialImpact}
          </div>
        </div>
      </div>

      {/* Parameters Table */}
      <table className="risk-params-table">
        <tbody>
          <tr>
            <td>Upwind Fire Activity:</td>
            <td className="mono" style={{ color: '#ea580c' }}>{plumeData.upwindFireCount} Active Hotspots</td>
          </tr>
          <tr>
            <td>Fire Intensity (FRP):</td>
            <td style={{ color: '#ea580c' }}>{plumeData.fireRadiativePower}</td>
          </tr>
          <tr>
            <td>Wind Direction:</td>
            <td className="mono">{plumeData.windDirection}</td>
          </tr>
          <tr>
            <td>Wind Speed:</td>
            <td className="mono">{plumeData.windSpeed} m/s</td>
          </tr>
          <tr>
            <td>Transport Window:</td>
            <td className="mono">{plumeData.transportWindow}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, marginBottom: 10 }}>
        "Fire activity, wind direction and atmospheric conditions are combined to estimate potential regional plume influence."
      </p>

      {/* Expand/Collapse Details */}
      {expanded && (
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            padding: '10px 12px',
            marginBottom: 10,
            fontSize: 12,
            color: '#334155',
          }}
        >
          <div style={{ marginBottom: 4 }}>
            <strong>Source Corridor:</strong> {plumeData.trajectorySource}
          </div>
          <div style={{ marginBottom: 4 }}>
            <strong>Estimated Plume Share:</strong> <span className="mono">{plumeData.estimatedContribution}</span>
          </div>
          <div style={{ color: '#64748b' }}>
            {plumeData.notes}
          </div>
        </div>
      )}

      <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginBottom: 12 }}>
        * Demonstration proxy risk index. Exact chemical mass flux requires continuous emission trajectory coupling.
      </div>

      <button className="btn-secondary" onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? 'Collapse Plume Trajectory' : 'Expand Plume Trajectory Details'}</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
}
