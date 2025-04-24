import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';

// Changed the import to match our file
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-900 text-white">
        <Routes>
          <Route path="/" element={<AnalyzePage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;