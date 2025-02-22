import { configureStore } from "@reduxjs/toolkit";
import userAuthSlice from "./slices/userAuthSlice";
import authModalSlice from "./slices/authModalSlice";
import { authMiddleware, initializeAuth } from './middleware/authMiddleware';
import propertySlice from "./slices/propertySlice";
import wishlistSlice from './slices/wishlistSlice';
import chatSlice from './slices/chatSlice';

const preloadedState = {
  userAuth: {
    user: null,
    isAuthenticated: false,
    token: initializeAuth()
  }
};

export const store = configureStore({
  reducer: {
    [userAuthSlice.name]: userAuthSlice.reducer, 
    [authModalSlice.name]: authModalSlice.reducer,
    [propertySlice.name]: propertySlice.reducer,
    [wishlistSlice.name]: wishlistSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
