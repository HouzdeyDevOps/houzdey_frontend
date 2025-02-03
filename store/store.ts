// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./slices/userAuthSlice";
import authModalSlice from "./slices/authModalSlice";

export const store = configureStore({
  reducer: {
    [userAuthSlice.name]: userAuthSlice.reducer, 
    [authModalSlice.name]: authModalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
