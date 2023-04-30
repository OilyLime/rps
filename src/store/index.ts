import { configureStore } from '@reduxjs/toolkit';
import { websocketMiddleware } from './websocketMiddleware';
import rootReducer from './reducers';

export const store = configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) => {
    //     return getDefaultMiddleware().concat([websocketMiddleware])
    // },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;