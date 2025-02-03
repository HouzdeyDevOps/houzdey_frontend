import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthModalState {
  isSignUpOpen: boolean;
  isSignInOpen: boolean;
  isVerificationOpen: boolean;
  isPersonalInfoOpen: boolean;
}

const initialState: AuthModalState = {
  isSignUpOpen: false,
  isSignInOpen: false,
  isVerificationOpen: false,
  isPersonalInfoOpen: false,
};

const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    openSignUp: (state) => {
      state.isSignUpOpen = true;
      state.isSignInOpen = false;
    },
    openSignIn: (state) => {
      state.isSignInOpen = true;
      state.isSignUpOpen = false;
    },
    closeAllModals: (state) => {
      state.isSignUpOpen = false;
      state.isSignInOpen = false;
      state.isVerificationOpen = false;
      state.isPersonalInfoOpen = false;
    },
  },
});

export const { openSignUp, openSignIn, closeAllModals } = authModalSlice.actions;
export default authModalSlice;