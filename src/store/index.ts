import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import drugsReducer from './slices/drugsSlice';
import draftsReducer from './slices/draftsSlice';
import masterDataReducer from './slices/masterDataSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    drugs: drugsReducer,
    drafts: draftsReducer,
    masterData: masterDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
