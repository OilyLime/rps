import React, { useState } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './Game.css';

const getOpponentChoice = () => {
  const choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
};

const Game: React.FC = () => {
  const [choice, setChoice] = useState<string | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<string | null>(null);

  const getImageComponent = (choice: string | null) => {
    if (choice === 'rock') return <StaticImage src="../images/rock.png" alt="Rock" />;
    if (choice === 'paper') return <StaticImage src="../images/paper.png" alt="Paper" />;
    if (choice === 'scissors') return <StaticImage src="../images/scissors.png" alt="Scissors" />;
    return null;
  };


  return (
    <div className="game">
      <h2>Opponent</h2>
      <div className="opponent-choice">{opponentChoice && getImageComponent(opponentChoice)}</div>
      <div className="animation-container">{choice && getImageComponent(choice)}</div>
      <h2>You</h2>
      <div className="buttons">
        <button onClick={() => { setChoice('rock'); setOpponentChoice(getOpponentChoice()); }}>Rock</button>
        <button onClick={() => { setChoice('paper'); setOpponentChoice(getOpponentChoice()); }}>Paper</button>
        <button onClick={() => { setChoice('scissors'); setOpponentChoice(getOpponentChoice()); }}>Scissors</button>
      </div>
    </div>
  );
};

export default Game;