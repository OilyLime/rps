import React, { useEffect } from "react";
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
  selectRoundState,
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
  position: fixed;
  top: 20px;
  left: 20px;
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

const socketURL = (gameId: string) =>
  (window.location.protocol === "https:" ? "wss://" : "ws://") +
  window.location.host +
  `/game/${gameId}`;

const Game: React.FC = () => {
  const { id: gameId } = useParams<{ id: string; name: string }>();

  const { sendMessage } = useWebSocket(socketURL(gameId ?? ""));
  useEffect(() => {
    sendMessage(JSON.stringify({ type: "whoami", time: Date.now() }));
  }, [sendMessage]);

  const roundState = useSelector(selectRoundState);
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

  // {"type":"result","time":1682826128075,"data":{"number":0,"time":1682826118508,"choices":[["Plum Fish","rock"],["Green Bird","paper"]],"winner":"Green Bird"}}

  return (
    <Block>
      <CopyButton onClick={copyUrl}>Copy URL</CopyButton>
      <ConnectedPlayers playerName={playerName} players={connectedPlayers} />
      <GameWrapper>
        <RoundHistory>
          {rounds.map((round, index) => (
            <RoundResult key={index}>
              <img
                src={`/${round.choices[0][1]}.png`}
                alt={round.choices[0][1]}
                width="40"
              />
              <span>
                {round.winner === playerName && "✅"}
                {round.winner !== playerName && "❌"}
                {round.winner === "" && "⭕"}
              </span>
              <img
                src={`/${round.choices[1][1]}.png`}
                alt={round.choices[1][1]}
                width="40"
              />
            </RoundResult>
          ))}
        </RoundHistory>
        <MainBox>
          {roundState === "start" && "Let's Start"}
          {roundState === "waiting" && "Waiting for Opponent"}
          {roundState === "complete" && "Round Complete"}
          <ChoicesContainer>
            <ChoiceImage
              src="/rock.png"
              alt="rock"
              id="rock"
              onClick={handleChoice(Choice.Rock)}
              disabled={roundState === "complete"}
            />
            <ChoiceImage
              src="/paper.png"
              alt="paper"
              id="paper"
              onClick={handleChoice(Choice.Paper)}
              disabled={roundState === "complete"}
            />
            <ChoiceImage
              src="/scissors.png"
              alt="scissors"
              id="scissors"
              onClick={handleChoice(Choice.Scissors)}
              disabled={roundState === "complete"}
            />
          </ChoicesContainer>
        </MainBox>
      </GameWrapper>
    </Block>
  );
};

export default Game;
