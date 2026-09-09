import React, { useState } from 'react';
import { Layers, AlertCircle, Info, ChevronRight, X, ShieldAlert } from 'lucide-react';

export default function InversionRisk({ inversionData }) {
  const [showModal, setShowModal] = useState(false);

  const getMeterColor = (val) => {
    if (val < 40) return '#10b981';
    if (val < 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="tech-card">
      <div className="card-header-row">
        <div>
          <div className="card-title">
            <Layers size={17} color="#dc2626" />
            Atmospheric Inversion / Trapping Risk
          </div>
          <div className="card-subtitle">Boundary layer ventilation dynamics</div>
        </div>
        <span
          className="kpi-status-badge"
          style={{
            backgroundColor: inversionData.status === 'HIGH' ? '#fef2f2' : '#fffbeb',
            color: inversionData.status === 'HIGH' ? '#b91c1c' : '#b45309',
            border: `1px solid ${inversionData.status === 'HIGH' ? '#fca5a5' : '#fde68a'}`,
          }}
        >
          {inversionData.status}
        </span>
      </div>

      <div style={{ marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600 }}>
          <span style={{ color: '#475569' }}>Pollution Trapping Potential</span>
          <span className="mono" style={{ color: getMeterColor(inversionData.trappingPotential), fontWeight: 700 }}>
            {inversionData.trappingPotential}% ({inversionData.status})
          </span>
        </div>

        {/* Progress / Risk Meter */}
        <div className="risk-meter-container">
          <div
            className="risk-meter-fill"
            style={{
              width: `${inversionData.trappingPotential}%`,
              backgroundColor: getMeterColor(inversionData.trappingPotential),
            }}
          />
        </div>
      </div>

      {/* Atmospheric Diagnostic Parameters Table */}
      <table className="risk-params-table">
        <tbody>
          <tr>
            <td>PBL Height:</td>
            <td className="mono">{inversionData.pblHeight} m</td>
          </tr>
          <tr>
            <td>Wind Speed:</td>
            <td className="mono">{inversionData.windSpeed} m/s</td>
          </tr>
          <tr>
            <td>Static Stability:</td>
            <td style={{ color: '#b91c1c' }}>{inversionData.stability}</td>
          </tr>
          <tr>
            <td>Relative Humidity:</td>
            <td className="mono">{inversionData.humidity}%</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, marginBottom: 12 }}>
        "Weak winds and a shallow boundary layer can reduce pollutant dispersion and increase near-surface accumulation."
      </p>

      <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginBottom: 12 }}>
        * Prototype risk indicator, NOT a claim of full scientific inversion diagnosis.
      </div>

      <button className="btn-secondary" onClick={() => setShowModal(true)}>
        <span>View Risk Factors</span>
        <ChevronRight size={14} />
      </button>

      {/* Modal / Dialog for Risk Factors */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={20} color="#dc2626" />
                Atmospheric Inversion Risk Factors
              </div>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>
              Coupled physics variables evaluated from WRF-Chem atmospheric vertical profile:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {inversionData.riskFactors.map((rf, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong style={{ fontSize: 13, color: '#0f172a' }}>{rf.name}</strong>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>
                      {rf.value}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Threshold: <strong>{rf.threshold}</strong> &bull; {rf.impact}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18, textAlign: 'right' }}>
              <button
                className="location-btn active"
                style={{ padding: '6px 16px' }}
                onClick={() => setShowModal(false)}
              >
                Close Diagnostic View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
