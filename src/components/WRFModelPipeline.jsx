import React from 'react';
import { Network, Database, Cpu, Wind, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { WRF_CHEM_METADATA } from '../data/demoData';

export default function WRFModelPipeline() {
  return (
    <div className="pipeline-card">
      <div className="card-header-row">
        <div>
          <div className="card-title">
            <Network size={18} color="#2563eb" />
            Coupled Modeling Pipeline Architecture
          </div>
          <div className="card-subtitle">
            Physics-Based WRF-Chem Simulation with AI Post-Processing Layer
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge-demo" style={{ background: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' }}>
            {WRF_CHEM_METADATA.status}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="pipeline-diagram">
        {/* Node 1 */}
        <div className="pipeline-node">
          <div className="pipeline-node-title">1. Input Data Feeds</div>
          <div className="pipeline-node-sub">GFS 0.25° Meteorology + EDGAR/SAFAR Emissions + MODIS/VIIRS Active Fires</div>
          <div className="pipeline-outputs-pills">
            <span className="output-pill">Weather</span>
            <span className="output-pill">Emissions</span>
            <span className="output-pill">Aerosol</span>
          </div>
        </div>

        <ArrowRight size={20} color="#94a3b8" />

        {/* Node 2 */}
        <div className="pipeline-node active-node">
          <div className="pipeline-node-title" style={{ color: '#1d4ed8' }}>
            2. WRF-Chem Coupled Run
          </div>
          <div className="pipeline-node-sub">
            RADM2 + MADE/SORGAM aerosol chemistry coupled with 3km nested grid (d03)
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginTop: 4 }}>
            Physics-Based Atmospheric Simulation
          </div>
        </div>

        <ArrowRight size={20} color="#94a3b8" />

        {/* Node 3 */}
        <div className="pipeline-node">
          <div className="pipeline-node-title">3. Raw Model Forecast</div>
          <div className="pipeline-node-sub">
            Simulated 3D concentration fields &amp; boundary layer thermodynamics
          </div>
          <div className="pipeline-outputs-pills">
            <span className="output-pill">PM2.5</span>
            <span className="output-pill">O3</span>
            <span className="output-pill">PBLH</span>
            <span className="output-pill">Wind</span>
            <span className="output-pill">Temp</span>
          </div>
        </div>

        <ArrowRight size={20} color="#94a3b8" />

        {/* Node 4 */}
        <div className="pipeline-node">
          <div className="pipeline-node-title">4. AI Bias Correction</div>
          <div className="pipeline-node-sub">
            Gradient boosted residual downscaling trained on historical CPCB ground monitors
          </div>
          <div className="pipeline-outputs-pills">
            <span className="output-pill">XGBoost</span>
            <span className="output-pill">LightGBM</span>
          </div>
        </div>

        <ArrowRight size={20} color="#94a3b8" />

        {/* Node 5 */}
        <div className="pipeline-node" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="pipeline-node-title" style={{ color: '#15803d' }}>
            5. Calibrated 72h Forecast
          </div>
          <div className="pipeline-node-sub" style={{ color: '#166534' }}>
            Final sub-region forecast + Inversion &amp; Plume risk alerts
          </div>
          <div className="pipeline-outputs-pills">
            <span className="output-pill" style={{ borderColor: '#86efac', color: '#166534' }}>
              High-Accuracy Output
            </span>
          </div>
        </div>
      </div>

      {/* Model Specifications Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: '8px 14px',
          fontSize: 12,
        }}
      >
        <div>
          <span style={{ color: '#64748b' }}>Simulation Engine:</span>{' '}
          <strong>{WRF_CHEM_METADATA.modelName}</strong>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Domain Resolution:</span>{' '}
          <strong>{WRF_CHEM_METADATA.domain}</strong>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Physics/Chemistry:</span>{' '}
          <strong>{WRF_CHEM_METADATA.physicsScheme}</strong>
        </div>
        <div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 11 }}>
          * Model output replayed from validated baseline runs for SIH prototype. Not executing on live HPC cluster.
        </div>
      </div>
    </div>
  );
}
