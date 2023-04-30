import React from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import useWebSocket from "../hooks/useWebSocket";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChoice,
  selectPlayers,
  selectPlayerName,
  selectRounds,
  setChoice,
} from "../store/slices/gameSlice";
import { Choice } from "../types";
import ConnectedPlayers from "./ConnectedPlayers";

const Block = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: wrap;
`;

const GameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const MainBox = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;
  align-items: center;
  background-color: #f5f0ea;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  margin-right: 20px;
`;

const ChoicesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const ChoiceImage = styled.img<{ disabled: boolean }>`
  max-width: 100px;
  cursor: pointer;
  filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const CopyButton = styled.button`
  margin-bottom: 20px;
  background-color: #3b3e6b;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
`;

const RoundHistory = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  background-color: #f5f0ea;
  padding: 20px;
  border-radius: 5px;
  margin-right: 20px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
`;

const RoundResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
`;

const Game: React.FC = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const socketURL =
    (window.location.protocol === "https:" ? "wss://" : "ws://") +
    window.location.host +
    `/game/${gameId}`;

  const { sendMessage } = useWebSocket(socketURL);

  const playerName = useSelector(selectPlayerName);
  const connectedPlayers = useSelector(selectPlayers);
  const choice = useSelector(selectChoice);
  const rounds = useSelector(selectRounds);

  const dispatch = useDispatch();

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleChoice = (selectedChoice: Choice) => () => {
    // Dispatch the setChoice action when a choice is clicked
    sendMessage(
      JSON.stringify({
        type: "choice",
        time: Date.now(),
        data: { choice: selectedChoice },
      })
    );
    dispatch(setChoice(selectedChoice));
  };

  console.log('connected players', connectedPlayers)

  return (
    <Block>
      <ConnectedPlayers players={connectedPlayers} />
      <GameWrapper>
        <RoundHistory>
          {rounds.map((round, index) => (
            <RoundResult key={index}>
              <img
                src={`/${round.playerChoice}.png`}
                alt={round.playerChoice}
                width="40"
              />
              <span>
                {round.result === "win" && "✅"}
                {round.result === "lose" && "❌"}
                {round.result === "draw" && "⭕"}
              </span>
              <img
                src={`/${round.opponentChoice}.png`}
                alt={round.opponentChoice}
                width="40"
              />
            </RoundResult>
          ))}
        </RoundHistory>
        <MainBox>
          <CopyButton onClick={copyUrl}>Copy URL</CopyButton>
          <span>
            Your name: <h2>{playerName}</h2>
          </span>
          <ChoicesContainer>
            <ChoiceImage
              src="/rock.png"
              alt="rock"
              id="rock"
              onClick={handleChoice(Choice.Rock)}
              disabled={choice !== ""}
            />
            <ChoiceImage
              src="/paper.png"
              alt="paper"
              id="paper"
              onClick={handleChoice(Choice.Paper)}
              disabled={choice !== ""}
            />
            <ChoiceImage
              src="/scissors.png"
              alt="scissors"
              id="scissors"
              onClick={handleChoice(Choice.Scissors)}
              disabled={choice !== ""}
            />
          </ChoicesContainer>
        </MainBox>
      </GameWrapper>
    </Block>
  );
};

export default Game;
