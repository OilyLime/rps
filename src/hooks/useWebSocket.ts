import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPlayerName, setPlayers, setChoice, setRounds } from "../store/slices/gameSlice";

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const dispatch = useDispatch();
  

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setSocket(ws);
      console.log('banana', message)

      switch (message.type) {
        case "whoami":
          console.log('whoami', message.data)
          dispatch(setPlayerName(message.data.playerName));
          break;
        case "connected":
          console.log('connected', message.data)
          dispatch(setPlayers(message.data));
          break;
        case "choice":
          dispatch(setChoice(message.data.choice));
          break;
        case "result":
          dispatch(setRounds(message.data.round));
          break;
        default:
          break;
        }
      };
  
      ws.onopen = () => {
        setSocketConnected(true);
        ws.send(JSON.stringify({ type: 'whoami', time: Date.now() }));
        console.log("WebSocket connected");
      };
  
      ws.onclose = () => {
        setSocketConnected(false);
        console.log("WebSocket disconnected");
      };
  
      return () => {
        ws.close();
      };
    }, [url]);

    const sendMessage = useCallback(
      (message: string) => {
        console.log('sendMessage', message)
        if (socket) {
          socket.send(message);
        }
      },
      [socket]
    );

    return { socketConnected, sendMessage };
  };
  
  export default useWebSocket;