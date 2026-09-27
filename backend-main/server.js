const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// NORMAL BACKEND ROUTES (CRUD, Auth, Preferences, etc.)
// ----------------------------------------------------

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Main Node Backend' });
});

// 2. User Preferences (Mock DB)
let userPreferences = {
  defaultLocation: 'delhi',
  notificationsEnabled: true,
};

app.get('/api/preferences', (req, res) => {
  res.json(userPreferences);
});

app.post('/api/preferences', (req, res) => {
  const { location, notifications } = req.body;
  if (location) userPreferences.defaultLocation = location;
  if (notifications !== undefined) userPreferences.notificationsEnabled = notifications;
  
  res.json({ message: 'Preferences updated successfully', data: userPreferences });
});

// ----------------------------------------------------
// AI MICROSERVICE COMMUNICATION (Proxying to Python)
// ----------------------------------------------------
// In production, set process.env.AI_BACKEND_URL to your deployed Python server's URL.
const AI_BACKEND_URL = process.env.AI_BACKEND_URL || 'http://localhost:8000';

app.post('/api/predict', async (req, res) => {
  try {
    // The frontend sends data here, and Node forwards it to Python
    const aiResponse = await fetch(`${AI_BACKEND_URL}/api/ai/predict-correction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body) // e.g. location_id, current_aqi, temperature, wind_speed
    });
    
    if (!aiResponse.ok) throw new Error(`AI Service Error: ${aiResponse.statusText}`);
    
    const aiData = await aiResponse.json();
    res.json(aiData);
  } catch (error) {
    console.error("Error communicating with AI Backend:", error.message);
    res.status(500).json({ error: "Failed to process AI prediction" });
  }
});

app.get('/api/plume-risk', async (req, res) => {
  try {
    const locationId = req.query.location || 'delhi';
    const aiResponse = await fetch(`${AI_BACKEND_URL}/api/ai/plume-risk?location_id=${locationId}`);
    
    if (!aiResponse.ok) throw new Error(`AI Service Error: ${aiResponse.statusText}`);
    
    const aiData = await aiResponse.json();
    res.json(aiData);
  } catch (error) {
    console.error("Error communicating with AI Backend:", error.message);
    res.status(500).json({ error: "Failed to calculate plume risk" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Main Backend Server running on http://localhost:${PORT}`);
});
