import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer from './components/gameState';

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;