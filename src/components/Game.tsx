import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { PlayerChoice } from '../../rps-game-state/src/types'
import styled from "styled-components";

const GameContainer = styled.div`
    display: flex;
    justify-content:space-evenly;
    align-items: center;
    color: white;
    background-color: #131A22;
`

const ButtonGroup = styled.div`

  display: flex;
  gap: 1rem;

`

const Button = styled.button`
padding: 0.5rem 1rem;
font-size: 1rem;
cursor: pointer;
`

type IncomingEvent = {
  type: string;
  time: number;
  data: Record<string, any>;
}

const Game: React.FC = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [round, setRounds] = useState<number>(0);
  const [wins, setWins] = useState<number>(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;

    const wsUrl = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + `/game/${gameId}`;
    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'whoami', time: Date.now() }));
    };

    ws.onmessage = (message) => {
      const event = JSON.parse(message.data) as IncomingEvent;
      console.log('event', event)
      switch (event.type) {
        case 'whoami':
          setPlayerId(() => event.data.playerId);
          break;
        case 'result':
          setRounds(event.data.number)
          const choices = new Map<string, string>(event.data.choices);
          choices.forEach((choice, player) => {
            if (player !== playerId) setOpponentChoice(choice);
          });
          if (event.data.winner === playerId) setWins((prevWins) => prevWins + 1);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [gameId]);


  const handleChoice = (choice: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'choice', time: Date.now(), data: { choice } } as PlayerChoice))
    setChoice(choice)
  }

  return (
    <GameContainer>
      <h1>Game ID: {gameId}</h1>
      <h1>Player ID: {playerId}</h1>
      <h2>Rounds: {round + 1}</h2>
      <h2>Wins: {wins}</h2>
      <h2>Opponent</h2>
      <div className="opponent-choice">
        <h3>Opponent's Choice:</h3>
        {opponentChoice}
      </div>
      <h2>You</h2>
      <div className="animation-container">
        <h3>Your Choice:</h3>
        {choice}
      </div>
      <ButtonGroup>
        <Button onClick={() => { handleChoice('rock') }}>Rock</Button>
        <Button onClick={() => { handleChoice('paper') }}>Paper</Button>
        <Button onClick={() => { handleChoice('scissors') }}>Scissors</Button>
      </ButtonGroup>
    </GameContainer>
  );
};

export default Game;