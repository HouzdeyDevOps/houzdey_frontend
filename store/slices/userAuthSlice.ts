import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  profile_picture?: string;
  phone_number?: string;
  phone_verified?: boolean;
  status?: string;
  role?: string;
}


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  token: string | null;
  email: string | null;
  verificationCode: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  token: null,
  email: null,
  verificationCode: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isInitialized = true;

     // Store in localStorage for persistence
     localStorage.setItem('token', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('wishlist');
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      localStorage.setItem('auth', JSON.stringify({ ...auth, user: action.payload }));
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload;
    },
  },
});

export const { login, logout, setInitialized, updateUser, setEmail, setVerificationCode } = userAuthSlice.actions;
export default userAuthSlice;
