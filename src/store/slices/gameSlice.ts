import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index"

export interface GameState {
  playerName: string;
  players: string[];
  choice: string;
  rounds: any[];
}

const initialState: GameState = {
  playerName: "",
  players: [],
  choice: "",
  rounds: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setPlayerName: (state, action) => {
      console.log(state, action)
      state.playerName = action.payload;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setChoice: (state, action) => {
      state.choice = action.payload;
    },
    setRounds: (state, action) => {
      state.rounds = [...state.rounds, action.payload];
    },
  },
});

// export const { addRound, addExistingState, clearGameState } = gameState.actions;

// export const selectPlayers = (state: RootState): string[] => state.gameState.players;
// export const selectRounds = (state: RootState): string[] => state.gameState.rounds;
// export const selectWins = (state: RootState): number => state.gameState.wins;

// export default gameState.reducer;

export const { setPlayerName, setPlayers, setChoice, setRounds } =
  gameSlice.actions;

export const selectPlayers = (state: RootState) => state.game.players;
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectChoice = (state: RootState) => state.game.choice;
export const selectRounds = (state: RootState) => state.game.rounds;

export default gameSlice.reducer;