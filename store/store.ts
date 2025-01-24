// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./slices/userAuthSlice";

export const store = configureStore({
  reducer: {
    [userAuthSlice.name]: userAuthSlice.reducer, // Add other slices as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
