import React, { useState } from "react";
import { useNavigate } from "react-router";

const NewGame: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  
    const handleCreateGame = async () => {
      setLoading(true);
      try {
        const response = await fetch('/new', { method: 'GET' });
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

  export default NewGame