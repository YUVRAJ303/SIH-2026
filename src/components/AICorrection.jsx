import React from 'react';
import { Cpu, CheckCircle2, TrendingUp, Sparkles, Layers } from 'lucide-react';

export default function AICorrection({ aiData }) {
  return (
    <div className="tech-card">
      <div className="card-header-row">
        <div>
          <div className="card-title">
            <Cpu size={17} color="#2563eb" />
            AI Forecast Enhancement (Post-Processing)
          </div>
          <div className="card-subtitle">Physics-model residual error minimization</div>
        </div>
        <span className="badge-demo">
          DEMO / SIMULATED AI OUTPUT
        </span>
      </div>

      {/* 4-Stat Comparison Grid */}
      <div className="ai-comparison-grid">
        <div className="ai-stat-box">
          <div className="ai-stat-label">WRF-Chem Forecast PM2.5</div>
          <div className="ai-stat-val mono" style={{ color: '#475569' }}>
            {aiData.wrfPm25} <span style={{ fontSize: 11, fontWeight: 'normal' }}>µg/m³</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>Physics Model Output</div>
        </div>

        <div className="ai-stat-box">
          <div className="ai-stat-label">Ground Observation</div>
          <div className="ai-stat-val mono" style={{ color: '#0f172a' }}>
            {aiData.groundObsPm25} <span style={{ fontSize: 11, fontWeight: 'normal' }}>µg/m³</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2 }}>CPCB / CAAQMS Node</div>
        </div>

        <div className="ai-stat-box" style={{ background: '#fef3c7', borderColor: '#fde68a' }}>
          <div className="ai-stat-label" style={{ color: '#92400e' }}>AI Estimated Correction</div>
          <div className="ai-stat-val mono" style={{ color: '#b45309' }}>
            {aiData.aiCorrection} <span style={{ fontSize: 11, fontWeight: 'normal' }}>µg/m³</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#b45309', marginTop: 2 }}>Learned Bias Offset</div>
        </div>

        <div className="ai-stat-box highlight">
          <div className="ai-stat-label" style={{ color: '#1d4ed8' }}>Corrected Forecast</div>
          <div className="ai-stat-val mono" style={{ color: '#1d4ed8' }}>
            {aiData.correctedPm25} <span style={{ fontSize: 11, fontWeight: 'normal' }}>µg/m³</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#2563eb', marginTop: 2 }}>Final Calibrated Value</div>
        </div>
      </div>

      {/* Model Spec & Architecture Info */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: '8px 12px',
          margin: '8px 0',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ color: '#64748b' }}>Architecture:</span>
          <strong style={{ color: '#0f172a' }}>{aiData.modelType}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ color: '#64748b' }}>Benchmark Gain:</span>
          <strong style={{ color: '#16a34a' }}>{aiData.rmseImprovement}</strong>
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
          Input Features: {aiData.features.join(' • ')}
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, marginTop: 4 }}>
        "AI learns systematic differences between physics-based model forecasts and ground observations to improve local forecast accuracy."
      </p>
    </div>
  );
}
