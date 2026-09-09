import React from 'react';
import { Database, Wind, Cpu, Layers, Flame, LineChart, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Multi-Source Data', sub: 'Weather + Chem + Fire', icon: Database },
  { id: 2, title: 'WRF-Chem Physics', sub: 'Coupled 3D Simulation', icon: Wind },
  { id: 3, title: 'AI Bias Correction', sub: 'XGBoost / LightGBM', icon: Cpu },
  { id: 4, title: 'Inversion Analysis', sub: 'PBL Trapping Risk', icon: Layers },
  { id: 5, title: 'Plume Trajectory', sub: 'Biomass Inflow Risk', icon: Flame },
  { id: 6, title: '72H Forecast Output', sub: 'Calibrated Local Outlook', icon: LineChart },
];

export default function ModelFlowSummary() {
  return (
    <div className="bottom-flow-summary">
      <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', minWidth: 150 }}>
        END-TO-END FLOW:
      </div>

      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, flex: 1, justifyContent: 'space-between' }}>
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <div className="flow-step-item">
                <div className="flow-step-icon-wrap">
                  <Icon size={16} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{step.title}</div>
                  <div style={{ fontSize: 10.5, color: '#64748b' }}>{step.sub}</div>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <ChevronRight size={16} color="#cbd5e1" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
