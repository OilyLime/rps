import { combineReducers } from "@reduxjs/toolkit";
import gameReducer from "../slices/gameSlice";

const rootReducer = combineReducers({
    game: gameReducer,
});

export default rootReducer;