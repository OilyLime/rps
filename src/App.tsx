import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game';
import Launch from './components/Launch';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/play/:id" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;