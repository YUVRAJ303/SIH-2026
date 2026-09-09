// Centralized realistic demo data for Delhi NCR Air Pollution - Weather Coupled Forecasting System (SIH26082)
// Note: All values are simulated/replay data for prototype demonstration.

export const LOCATIONS = [
  { id: 'delhi', name: 'Delhi (Central / ITO)', lat: 28.6139, lng: 77.2090, defaultAQI: 187 },
  { id: 'noida', name: 'Noida (Sector 62)', lat: 28.5355, lng: 77.3910, defaultAQI: 164 },
  { id: 'ghaziabad', name: 'Ghaziabad (Vasundhara)', lat: 28.6692, lng: 77.4538, defaultAQI: 212 },
  { id: 'gurugram', name: 'Gurugram (Vikas Sadan)', lat: 28.4595, lng: 77.0266, defaultAQI: 151 },
  { id: 'faridabad', name: 'Faridabad (New Industrial Town)', lat: 28.4089, lng: 77.3178, defaultAQI: 176 },
];

export const AQI_CATEGORIES = [
  { label: 'Good', min: 0, max: 50, color: '#10b981', textColor: '#065f46', bgLight: '#ecfdf5', borderColor: '#a7f3d0' },
  { label: 'Moderate', min: 51, max: 100, color: '#84cc16', textColor: '#3f6212', bgLight: '#f7fee7', borderColor: '#d9f99d' },
  { label: 'Poor', min: 101, max: 200, color: '#f59e0b', textColor: '#92400e', bgLight: '#fffbeb', borderColor: '#fde68a' },
  { label: 'Very Poor', min: 201, max: 300, color: '#f97316', textColor: '#9a3412', bgLight: '#fff7ed', borderColor: '#fed7aa' },
  { label: 'Severe', min: 301, max: 500, color: '#ef4444', textColor: '#991b1b', bgLight: '#fef2f2', borderColor: '#fecaca' },
];

export function getAQICategory(aqi) {
  if (aqi <= 50) return AQI_CATEGORIES[0];
  if (aqi <= 100) return AQI_CATEGORIES[1];
  if (aqi <= 200) return AQI_CATEGORIES[2];
  if (aqi <= 300) return AQI_CATEGORIES[3];
  return AQI_CATEGORIES[4];
}

export const LOCATION_DATA = {
  delhi: {
    name: 'Delhi (ITO Station)',
    current: {
      aqi: 187,
      category: 'Poor',
      pm25: 142,
      pm10: 190,
      o3: 76,
      no2: 48,
      so2: 14,
      co: 1.6,
    },
    weather: {
      temp: 12,
      windSpeed: 1.8,
      windDirection: 'NW',
      windDegrees: 315,
      humidity: 78,
      pblHeight: 420,
      surfacePressure: 1014,
      dewPoint: 8,
    },
    inversion: {
      status: 'HIGH',
      pblHeight: 420,
      windSpeed: 1.8,
      stability: 'HIGH',
      humidity: 78,
      trappingPotential: 82,
      riskLevel: 'High Trapping Risk',
      riskFactors: [
        { name: 'Low Wind Speed', value: '1.8 m/s', threshold: '< 2.5 m/s', impact: 'Suppresses horizontal atmospheric ventilation' },
        { name: 'Shallow PBL Height', value: '420 m', threshold: '< 600 m', impact: 'Severely limits vertical dispersion volume' },
        { name: 'High Static Stability', value: 'Richardson No. > 0.25', threshold: 'Stable regime', impact: 'Dampens turbulent mixing at surface layer' },
        { name: 'Elevated Relative Humidity', value: '78%', threshold: '> 70%', impact: 'Accelerates secondary hygroscopic aerosol growth' },
      ],
    },
    plume: {
      risk: 'MODERATE',
      upwindFireCount: 23,
      fireRadiativePower: 'HIGH (420 MW avg)',
      windDirection: 'NW (315° towards NCR)',
      windSpeed: 1.8,
      transportWindow: '8–12 h',
      potentialImpact: 'MODERATE',
      trajectorySource: 'Punjab & Haryana Crop Biomass Belts',
      estimatedContribution: '18% – 26% of PM2.5 loading',
      notes: 'Fire activity, wind direction and atmospheric conditions are combined to estimate potential regional plume influence.',
    },
    aiCorrection: {
      wrfPm25: 180,
      groundObsPm25: 220,
      aiCorrection: '+18',
      correctedPm25: 198,
      modelType: 'LightGBM / XGBoost Non-linear Residual Regressor',
      features: ['2m Temperature', '10m U/V Wind', 'WRF Boundary Layer Height', 'Satellite AOD (MODIS)', 'Diurnal Traffic Profile'],
      rmseImprovement: '31.4% error reduction vs raw WRF-Chem',
    },
  },
  noida: {
    name: 'Noida (Sector 62)',
    current: {
      aqi: 164,
      category: 'Moderate / Poor',
      pm25: 126,
      pm10: 172,
      o3: 68,
      no2: 41,
      so2: 12,
      co: 1.4,
    },
    weather: {
      temp: 13,
      windSpeed: 2.1,
      windDirection: 'WNW',
      windDegrees: 290,
      humidity: 74,
      pblHeight: 460,
      surfacePressure: 1013,
      dewPoint: 8,
    },
    inversion: {
      status: 'MODERATE-HIGH',
      pblHeight: 460,
      windSpeed: 2.1,
      stability: 'MODERATE',
      humidity: 74,
      trappingPotential: 72,
      riskLevel: 'Moderate Trapping Risk',
      riskFactors: [
        { name: 'Low Wind Speed', value: '2.1 m/s', threshold: '< 2.5 m/s', impact: 'Marginal horizontal advective clearing' },
        { name: 'Moderate PBL Height', value: '460 m', threshold: '< 600 m', impact: 'Constrained vertical dispersion boundary' },
        { name: 'Atmospheric Stability', value: 'Neutral-Stable', threshold: 'Near threshold', impact: 'Moderate mixing resistance' },
        { name: 'Relative Humidity', value: '74%', threshold: '> 70%', impact: 'Moisture favors particulate accumulation' },
      ],
    },
    plume: {
      risk: 'MODERATE',
      upwindFireCount: 23,
      fireRadiativePower: 'HIGH (420 MW avg)',
      windDirection: 'WNW',
      windSpeed: 2.1,
      transportWindow: '10–14 h',
      potentialImpact: 'MODERATE',
      trajectorySource: 'Upwind agricultural fires',
      estimatedContribution: '15% – 22% of PM2.5 loading',
      notes: 'Plume path slightly shifted westward but partial downwind dispersion affects eastern NCR.',
    },
    aiCorrection: {
      wrfPm25: 162,
      groundObsPm25: 195,
      aiCorrection: '+14',
      correctedPm25: 176,
      modelType: 'LightGBM / XGBoost Non-linear Residual Regressor',
      features: ['2m Temperature', '10m U/V Wind', 'WRF Boundary Layer Height', 'Satellite AOD (MODIS)', 'Diurnal Traffic Profile'],
      rmseImprovement: '28.9% error reduction vs raw WRF-Chem',
    },
  },
  ghaziabad: {
    name: 'Ghaziabad (Vasundhara)',
    current: {
      aqi: 212,
      category: 'Very Poor',
      pm25: 168,
      pm10: 228,
      o3: 62,
      no2: 54,
      so2: 17,
      co: 1.9,
    },
    weather: {
      temp: 11.5,
      windSpeed: 1.4,
      windDirection: 'NW',
      windDegrees: 320,
      humidity: 82,
      pblHeight: 380,
      surfacePressure: 1014,
      dewPoint: 8.5,
    },
    inversion: {
      status: 'HIGH',
      pblHeight: 380,
      windSpeed: 1.4,
      stability: 'VERY HIGH',
      humidity: 82,
      trappingPotential: 91,
      riskLevel: 'Severe Inversion Trapping',
      riskFactors: [
        { name: 'Stagnant Calm Winds', value: '1.4 m/s', threshold: '< 1.5 m/s', impact: 'Near-total stagnation of surface airmass' },
        { name: 'Very Shallow PBL', value: '380 m', threshold: '< 400 m', impact: 'Strong nocturnal thermal inversion cap' },
        { name: 'High Static Stability', value: 'Strong Inversion', threshold: 'Stable regime', impact: 'Zero convective updraft mixing' },
        { name: 'High Humidity', value: '82%', threshold: '> 75%', impact: 'Fog condensation nuclei activation' },
      ],
    },
    plume: {
      risk: 'HIGH',
      upwindFireCount: 23,
      fireRadiativePower: 'HIGH (420 MW avg)',
      windDirection: 'NW',
      windSpeed: 1.4,
      transportWindow: '7–10 h',
      potentialImpact: 'HIGH',
      trajectorySource: 'Direct northwestern corridor inflow',
      estimatedContribution: '24% – 33% of PM2.5 loading',
      notes: 'Industrial local emissions combine with regional stubble plume under stagnant inversion layer.',
    },
    aiCorrection: {
      wrfPm25: 205,
      groundObsPm25: 252,
      aiCorrection: '+23',
      correctedPm25: 228,
      modelType: 'LightGBM / XGBoost Non-linear Residual Regressor',
      features: ['2m Temperature', '10m U/V Wind', 'WRF Boundary Layer Height', 'Satellite AOD (MODIS)', 'Industrial Emission Grid'],
      rmseImprovement: '34.2% error reduction vs raw WRF-Chem',
    },
  },
  gurugram: {
    name: 'Gurugram (Vikas Sadan)',
    current: {
      aqi: 151,
      category: 'Moderate',
      pm25: 114,
      pm10: 160,
      o3: 84,
      no2: 38,
      so2: 11,
      co: 1.2,
    },
    weather: {
      temp: 13.5,
      windSpeed: 2.4,
      windDirection: 'WNW',
      windDegrees: 295,
      humidity: 71,
      pblHeight: 510,
      surfacePressure: 1012,
      dewPoint: 7.5,
    },
    inversion: {
      status: 'MODERATE',
      pblHeight: 510,
      windSpeed: 2.4,
      stability: 'MODERATE',
      humidity: 71,
      trappingPotential: 62,
      riskLevel: 'Moderate Dispersion Resistance',
      riskFactors: [
        { name: 'Moderate Wind Flow', value: '2.4 m/s', threshold: '> 2.0 m/s', impact: 'Moderate mechanical ventilation along ridge' },
        { name: 'PBL Height', value: '510 m', threshold: '500-700 m', impact: 'Adequate vertical mixing buffer' },
        { name: 'Atmospheric Stability', value: 'Neutral', threshold: 'Stable regime', impact: 'Limited trapping relative to East NCR' },
        { name: 'Humidity', value: '71%', threshold: '< 75%', impact: 'Moderate humidity inhibits runaway condensation' },
      ],
    },
    plume: {
      risk: 'MODERATE-LOW',
      upwindFireCount: 23,
      fireRadiativePower: 'HIGH (420 MW avg)',
      windDirection: 'WNW',
      windSpeed: 2.4,
      transportWindow: '12–16 h',
      potentialImpact: 'MODERATE-LOW',
      trajectorySource: 'South-flank boundary layer transport',
      estimatedContribution: '12% – 19% of PM2.5 loading',
      notes: 'Aravalli topography slightly deflects surface trajectory away from southern core.',
    },
    aiCorrection: {
      wrfPm25: 145,
      groundObsPm25: 168,
      aiCorrection: '+11',
      correctedPm25: 156,
      modelType: 'LightGBM / XGBoost Non-linear Residual Regressor',
      features: ['2m Temperature', '10m U/V Wind', 'WRF Boundary Layer Height', 'Satellite AOD (MODIS)', 'Diurnal Traffic Profile'],
      rmseImprovement: '26.8% error reduction vs raw WRF-Chem',
    },
  },
  faridabad: {
    name: 'Faridabad (NIT)',
    current: {
      aqi: 176,
      category: 'Poor',
      pm25: 135,
      pm10: 182,
      o3: 72,
      no2: 44,
      so2: 15,
      co: 1.5,
    },
    weather: {
      temp: 12.8,
      windSpeed: 1.9,
      windDirection: 'NW',
      windDegrees: 310,
      humidity: 76,
      pblHeight: 440,
      surfacePressure: 1013,
      dewPoint: 8.2,
    },
    inversion: {
      status: 'HIGH',
      pblHeight: 440,
      windSpeed: 1.9,
      stability: 'HIGH',
      humidity: 76,
      trappingPotential: 78,
      riskLevel: 'High Trapping Risk',
      riskFactors: [
        { name: 'Low Wind Speed', value: '1.9 m/s', threshold: '< 2.5 m/s', impact: 'Restricted lateral clearing' },
        { name: 'Shallow Boundary Layer', value: '440 m', threshold: '< 600 m', impact: 'Traps industrial corridor emissions' },
        { name: 'Thermal Stability', value: 'Stable', threshold: 'Stable regime', impact: 'Inversion cap holds particulates at ground level' },
        { name: 'Humidity', value: '76%', threshold: '> 70%', impact: 'High aerosol hydration index' },
      ],
    },
    plume: {
      risk: 'MODERATE',
      upwindFireCount: 23,
      fireRadiativePower: 'HIGH (420 MW avg)',
      windDirection: 'NW',
      windSpeed: 1.9,
      transportWindow: '10–14 h',
      potentialImpact: 'MODERATE',
      trajectorySource: 'Trans-Delhi downwind drift',
      estimatedContribution: '16% – 24% of PM2.5 loading',
      notes: 'Plume drifts across Yamuna corridor accumulating with local industrial emissions.',
    },
    aiCorrection: {
      wrfPm25: 170,
      groundObsPm25: 208,
      aiCorrection: '+16',
      correctedPm25: 186,
      modelType: 'LightGBM / XGBoost Non-linear Residual Regressor',
      features: ['2m Temperature', '10m U/V Wind', 'WRF Boundary Layer Height', 'Satellite AOD (MODIS)', 'Industrial Point Sources'],
      rmseImprovement: '30.1% error reduction vs raw WRF-Chem',
    },
  },
};

// Generate 72-hour realistic continuous hourly forecast starting from "Now" (Hour 0)
// Diurnal cycle: peaks at night / early morning (stagnant PBL, heating, inversion), dips in mid-afternoon (higher PBL)
export function generate72hForecast(locationId = 'delhi') {
  const base = LOCATION_DATA[locationId] || LOCATION_DATA.delhi;
  const baseAQI = base.current.aqi;
  const basePM25 = base.current.pm25;
  const basePM10 = base.current.pm10;
  const baseO3 = base.current.o3;

  const points = [];
  const startHour = 18; // 18:00 IST

  for (let h = 0; h <= 72; h++) {
    const timeOfDay = (startHour + h) % 24;
    
    // Diurnal factor: higher around 04:00 - 08:00 (inversion + morning peak), lower around 14:00 - 16:00 (PBL expansion)
    const diurnalFactor = Math.sin(((timeOfDay - 2) / 24) * 2 * Math.PI) * -0.22;
    
    // Day trend: Slight buildup across Day 1 & 2 due to stagnant winds, moderate clearance by late Day 3
    let dayTrend = 0;
    if (h <= 24) {
      dayTrend = (h / 24) * 0.12;
    } else if (h <= 48) {
      dayTrend = 0.12 + ((h - 24) / 24) * 0.08;
    } else {
      dayTrend = 0.20 - ((h - 48) / 24) * 0.18;
    }

    // Micro-variation (deterministic sinusoidal noise for smooth natural look)
    const microVar = Math.sin(h * 0.8) * 0.04;
    const totalMultiplier = 1 + diurnalFactor + dayTrend + microVar;

    const aqi = Math.round(baseAQI * totalMultiplier);
    const pm25 = Math.round(basePM25 * totalMultiplier);
    const pm10 = Math.round(basePM10 * totalMultiplier * 0.96);
    
    // O3 is inversely related to PM and peaks during strong sunlight (12:00 - 16:00)
    const solarFactor = Math.max(0, Math.sin(((timeOfDay - 7) / 12) * Math.PI));
    const o3 = Math.round(baseO3 * (0.6 + solarFactor * 0.9 + Math.sin(h * 0.5) * 0.05));

    // Simulated raw WRF-Chem vs AI Corrected (WRF typically underpredicts peak winter surface PM)
    const rawWrfAqi = Math.round(aqi * 0.86);
    const rawWrfPm25 = Math.round(pm25 * 0.84);
    const aiCorrectionVal = Math.round(pm25 - rawWrfPm25);

    // Weather variation over 72h
    const pbl = Math.round(400 + Math.max(0, Math.sin(((timeOfDay - 7) / 14) * Math.PI)) * 550 + (h > 48 ? 120 : 0));
    const wind = +(1.6 + Math.sin(h * 0.15) * 0.7 + (h > 50 ? 1.2 : 0)).toFixed(1);

    const formattedLabel = h === 0 ? 'Now' : `+${h}h`;
    const fullDateStr = `+${h}h (${String(timeOfDay).padStart(2, '0')}:00)`;

    points.push({
      hour: h,
      label: formattedLabel,
      fullDateStr,
      aqi,
      rawWrfAqi,
      pm25,
      rawWrfPm25,
      aiCorrectionVal,
      pm10,
      o3,
      pblHeight: pbl,
      windSpeed: wind,
      isKeyMarker: h === 0 || h === 24 || h === 48 || h === 72,
    });
  }

  return points;
}

export const WRF_CHEM_METADATA = {
  modelName: 'WRF-Chem v4.4.2 (Coupled Weather-Chemistry)',
  domain: 'd03 (Delhi NCR 3km nested grid)',
  physicsScheme: 'YSU PBL + WSM6 Cloud Microphysics + RRTMG Radiation',
  chemMechanism: 'RADM2 gas-phase + MADE/SORGAM aerosol scheme',
  emissionInventory: 'EDGAR-HTAP + Regional Indian Emission Database (SAFAR/TERI)',
  runType: 'DEMO / REPLAY SIMULATION (Physics Based)',
  status: 'MODEL OUTPUT: DEMO / REPLAY',
  updateCycle: 'Coupled 72-Hour Outlook',
};
