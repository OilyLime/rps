import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../index"

export interface GameState {
  roundState: string;
  playerName: string;
  players: string[];
  choice: string;
  rounds: any[];
}

const initialState: GameState = {
  roundState: 'waiting',
  playerName: "",
  players: [],
  choice: "",
  rounds: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setRoundState: (state, action) => {
      state.roundState = action.payload
    },
    setPlayerName: (state, action) => {
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
    addRound: (state, action) => {
      state.rounds.push(action.payload)
    }
  },
});

// export const { addRound, addExistingState, clearGameState } = gameState.actions;

// export const selectPlayers = (state: RootState): string[] => state.gameState.players;
// export const selectRounds = (state: RootState): string[] => state.gameState.rounds;
// export const selectWins = (state: RootState): number => state.gameState.wins;

// export default gameState.reducer;

export const { setRoundState, setPlayerName, setPlayers, setChoice, setRounds, addRound } =
  gameSlice.actions;

export const selectRoundState = (state: RootState) => state.game.roundState;
export const selectPlayers = (state: RootState) => state.game.players;
export const selectPlayerName = (state: RootState) => state.game.playerName;
export const selectChoice = (state: RootState) => state.game.choice;
export const selectRounds = (state: RootState) => state.game.rounds;

export default gameSlice.reducer;