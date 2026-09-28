// src/data/featuresData.js
// Master list of project features — used to render the in-app "Excel sheet"
// page and to generate the downloadable .xlsx file.
// Edit this array to add/update features; both the on-screen table and the
// downloaded Excel file are generated from this single source of truth.

export const PROJECT_FEATURES = [
  { id: 1, module: 'Header / Judging Guide', feature: 'Judging Demo Sequence Panel', description: 'Collapsible 2–3 minute pitch/demo walkthrough guide for SIH judges, covering every dashboard section in presentation order.', status: 'Done' },
  { id: 2, module: 'Alerts', feature: 'Actionable Alert Banner', description: '12-hour-ahead advisory banner combining weather, inversion and plume data to support public-health and traffic-curb decisions.', status: 'Done' },
  { id: 3, module: 'AQI', feature: 'Current AQI & Pollutant KPI Cards', description: 'Live KPI cards for AQI, PM2.5, PM10 and O3 with an integrated location selector.', status: 'Done' },
  { id: 4, module: 'Map', feature: 'Delhi NCR Spatial Map', description: 'Full-width interactive map showing 5 sub-region sensor stations coupled with a 3 km WRF grid; click-to-select location.', status: 'Done' },
  { id: 5, module: 'Forecasting', feature: '72-Hour Forecast Chart', description: 'Diurnal-cycle forecast chart with a toggle between AI-corrected output and the raw WRF physics baseline.', status: 'Done' },
  { id: 6, module: 'Weather', feature: 'Coupled Weather Parameters Panel', description: 'Displays boundary-layer height, wind speed and related meteorological drivers of pollutant dispersion.', status: 'Done' },
  { id: 7, module: 'Risk Intelligence', feature: 'Atmospheric Inversion Risk', description: 'Thermodynamic stability threshold analysis with an expandable "View Risk Factors" breakdown.', status: 'Done' },
  { id: 8, module: 'Risk Intelligence', feature: 'Regional Biomass-Burning Plume Risk', description: 'Expandable trajectory view of upwind stubble/biomass-fire plume transit windows (e.g. NW 8–12h).', status: 'Done' },
  { id: 9, module: 'AI/ML', feature: 'AI Forecast Bias Correction', description: 'LightGBM / XGBoost post-processing layer that corrects WRF-Chem forecast bias without replacing the physics model.', status: 'Done' },
  { id: 10, module: 'Simulation Pipeline', feature: 'WRF-Chem Coupled Simulation Pipeline', description: 'Visual walkthrough of the 5-step coupled meteorology–chemistry simulation flow.', status: 'Done' },
  { id: 11, module: 'Simulation Pipeline', feature: 'Model Flow Summary', description: 'End-to-end summary card tying together the WRF-Chem pipeline and AI correction stages.', status: 'Done' },
  { id: 12, module: 'Backend (AI)', feature: 'Python AI Backend Service', description: 'Backend service exposing the AI/ML forecast-correction models to the frontend.', status: 'Done' },
  { id: 13, module: 'Backend (Main)', feature: 'Node.js Main Backend Service', description: 'Node/Express service handling core API requests between the frontend and data sources.', status: 'Done' },
  { id: 14, module: 'Deployment', feature: 'Vercel Frontend Deployment', description: 'Vite + React frontend configured for deployment to Vercel.', status: 'In Progress' },
  { id: 15, module: 'Reference', feature: 'Project Feature Sheet (this page)', description: 'In-app spreadsheet view of all project features with a one-click download as a real .xlsx file.', status: 'Done' },
];