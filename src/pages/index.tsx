import React, {useState} from "react"
import type { HeadFC, PageProps } from "gatsby"
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Game from "../components/Game"

const CreateGame: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/new' { method: 'GET'});
      const data = await response.json();
      const gameId = data.id;
      navigate(`/${gameId}`);
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

const App: React.FC<PageProps> = () => {
  return (
    <Router>

    <Routes>
      <Route path="/" element={<CreateGame />} />
      <Route path="/:id" element={<Game />} />
    </Routes>
  </Router>
  )
}

export default App

export const Head: HeadFC = () => <title>rps -OilyLime-</title>
