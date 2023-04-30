import React from 'react';
import styled from 'styled-components';

interface ConnectedPlayersProps {
  playerName: string;
  players: string[];
}

const ConnectedPlayersWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #f9a895;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
`;

const PlayerList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const PlayerListItem = styled.li`
  margin-bottom: 4px;
`;


const ConnectedPlayers: React.FC<ConnectedPlayersProps> = ({ playerName, players }) => {
  return (
    <ConnectedPlayersWrapper>
      <Title>Connected Players</Title>
      <PlayerList>
        {players.map((player, index) => (
          player === playerName ? <PlayerListItem key={index}>{player} 👈 (you)</PlayerListItem> : <PlayerListItem key={index}>{player}</PlayerListItem>
        ))}
      </PlayerList>
    </ConnectedPlayersWrapper>
  );
};

export default ConnectedPlayers;