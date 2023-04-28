import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Game from './Game';

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/new', { method: 'POST' });
      const data = await response.json();
      const gameId = data.id;
      navigate(`/play/${gameId}`);
    } catch (error) {
      setLoading(false);
      console.error('Error creating game:', error);
    }
  };

  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <button onClick={handleCreateGame} disabled={loading}>
        {loading ? 'Creating game...' : 'Create new game'}
      </button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateGame />} />
        <Route path="/play/:id" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;