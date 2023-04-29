import { createSlice, current } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface GameState {
   players: string[];
   rounds: any[];
   wins: number;
}

const initialState: GameState = {
    players: [],
    rounds:[],
    wins: 0
  };

export const gameState = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    addRound: (state, { payload }) => {
      // TODO
    },
    addExistingState: (state, { payload }) => {
      // TODO
    },
    clearGameState: (state) => {
      state.players = [];
      state.rounds = [];
      state.wins = 0;
    }
  }
});

export const { addRound, addExistingState, clearGameState } = gameState.actions;

export const selectPlayers = (state: RootState): string[] => state.gameState.players;
export const selectRounds = (state: RootState): string[] => state.gameState.rounds;
export const selectWins = (state: RootState): number => state.gameState.wins;

export default gameState.reducer;