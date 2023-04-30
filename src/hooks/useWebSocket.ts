import { useDispatch } from "react-redux";
import {
  setPlayerName,
  setPlayers,
  setChoice,
  addRound,
  setRoundState,
} from "../store/slices/gameSlice";

import { useWebSocket as reactUseWebSocket } from "react-use-websocket/dist/lib/use-websocket";

const useWebSocket = (url: string, playerName?: string) => {
  const dispatch = useDispatch();
  const { sendMessage } = reactUseWebSocket(url, {
    queryParams: playerName ? {name: playerName} : undefined,
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "state":
          dispatch(setRoundState(message.data.state));
          break
        case "whoami":
          dispatch(setPlayerName(message.data.playerName));
          break;
        case "players":
          dispatch(setPlayers(message.data));
          break;
        case "choice":
          dispatch(setChoice(message.data.choice));
          break;
        case "result":
          console.log('event type "result"', message.data)
          dispatch(addRound(message.data));
          break;
        default:
          break;
      }
    },
  });
  return { sendMessage };
};

export default useWebSocket;
