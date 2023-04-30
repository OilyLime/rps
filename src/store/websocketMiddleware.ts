import { Middleware } from 'redux'

export const websocketMiddleware: Middleware = (store) => (next) => (action) => {
    const { type, payload } = action;
    switch (type) {
        case "WS_WHOAMI":
        // Dispatch action to set the player's name
        break;
        case "WS_CONNECTED":
        // Dispatch action to handle player connection
        break;
        case "WS_CHOICE":
        // Dispatch action to handle player choice
        break;
        case "WS_RESULT":
        // Dispatch action to handle round result
        break;
        default:
        break;
    }

  return next(action);
};