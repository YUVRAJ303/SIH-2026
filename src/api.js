/**
 * Real-world APIs for Air Quality and Weather Data
 * 
 * Recommended APIs for SIH-2026 (Delhi NCR Air Quality & Modeling):
 * 
 * 1. Open-Meteo Air Quality API (Free, No API Key Required)
 *    - Docs: https://open-meteo.com/en/docs/air-quality-api
 *    - Good for: PM10, PM2.5, Carbon Monoxide, Nitrogen Dioxide, Ozone, Aerosol Optical Depth.
 *    - Supports 5-day forecasts, which is perfect for your 72h forecast chart.
 * 
 * 2. WAQI (World Air Quality Index) - Real-time AQI
 *    - Docs: https://aqicn.org/api/
 *    - Good for: Exact station-level current AQI (e.g., specific stations in Delhi).
 *    - Requires a free API token.
 * 
 * 3. OpenWeatherMap Air Pollution API
 *    - Docs: https://openweathermap.org/api/air-pollution
 *    - Good for: Current, forecast, and historical air pollution data.
 *    - Requires a free API key.
 * 
 * 4. NASA FIRMS (Fire Information for Resource Management System)
 *    - Docs: https://earthdata.nasa.gov/firms/api
 *    - Good for: "Biomass-Burning Plume Risk" (Stubble burning in Punjab/Haryana).
 *    - Requires a free Map Key.
 */

const OPEN_METEO_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// Helper function for coordinate mapping (Delhi NCR regions)
const getCoordinates = (locationId) => {
  const coords = {
    delhi: { lat: 28.6139, lon: 77.2090 },
    gurugram: { lat: 28.4595, lon: 77.0266 },
    noida: { lat: 28.5355, lon: 77.3910 },
    faridabad: { lat: 28.4089, lon: 77.3178 },
    ghaziabad: { lat: 28.6692, lon: 77.4538 }
  };
  return coords[locationId] || coords.delhi;
};

/**
 * Fetch current Air Quality data and 72-hour forecast using Open-Meteo
 */
export const fetchAirQualityData = async (locationId) => {
  const { lat, lon } = getCoordinates(locationId);
  
  // Fetching current and hourly (forecast) data for PM2.5, PM10, AQI
  const url = `${OPEN_METEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&hourly=us_aqi,pm10,pm2_5&timezone=Asia%2FKolkata&forecast_days=4`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch air quality data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error (Air Quality):', error);
    return null;
  }
};

export const fetchAirQualityByCoords = async (lat, lon) => {
  const url = `${OPEN_METEO_BASE_URL}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=Asia%2FKolkata`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch air quality data');
    return await response.json();
  } catch (error) {
    console.error('API Error (Air Quality):', error);
    return null;
  }
};

/**
 * Fetch current weather and weather forecasts (Wind speed, temp, planetary boundary layer height)
 */
export const fetchWeatherData = async (locationId) => {
  const { lat, lon } = getCoordinates(locationId);
  
  // We can fetch temperature, wind speed, and inversion risk indicators like surface pressure and visibility
  const url = `${OPEN_METEO_WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,visibility&timezone=Asia%2FKolkata`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error (Weather):', error);
    return null;
  }
};

/**
 * Fetch Active Fire Data (Stubble Burning / Plume Risk)
 * Recommended: NASA FIRMS API (Requires API Key)
 */
export const fetchFireData = async (apiKey) => {
  // Example FIRMS API call for India region
  // const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/70,20,90,35/1`;
  
  console.warn("NASA FIRMS API requires an API key. Returning mock data for Plume Risk.");
  // Return your mock data or structure here until you plug in the real key
  return {
    activeFires: 142,
    windTrajectory: "North-West to South-East",
    riskLevel: "High"
  };
};

/**
 * Mock endpoint for your Custom AI / WRF-Chem Pipeline Backend
 * You will likely build a Python (FastAPI/Flask) backend for this.
 */
export const fetchAICorrectionAndWRFData = async (locationId) => {
  // const url = `https://your-custom-backend.onrender.com/api/v1/wrf-model?location=${locationId}`;
  
  console.warn("Using placeholder for AI Correction & WRF Model Data.");
  return {
    inversionStrength: "Strong",
    pblHeight: 450, // Planetary Boundary Layer height in meters
    aiConfidence: 94,
    correctionApplied: "+15 AQI (Due to stagnation)"
  };
};
