import React, { useState } from "react"
import type { HeadFC, PageProps } from "gatsby"
import Game from "../components/Game"

const App: React.FC<PageProps> = () => {
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/new', { method: 'POST' });
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
}

export default App

export const Head: HeadFC = () => <title>rps -OilyLime-</title>
