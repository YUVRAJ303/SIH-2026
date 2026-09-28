import React, { useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import FeaturesSheet from './pages/FeaturesSheet';

function App() {
  const [page, setPage] = useState('dashboard'); // 'dashboard' | 'features'

  return (
    <main>
      {page === 'dashboard' && (
        <button
          onClick={() => setPage('features')}
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 6, background: '#15803d', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        >
          <FileSpreadsheet size={15} />
          View Feature Sheet
        </button>
      )}

      {page === 'dashboard' ? (
        <Dashboard />
      ) : (
        <FeaturesSheet onBack={() => setPage('dashboard')} />
      )}
    </main>
  );
}

export default App;