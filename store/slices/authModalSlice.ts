import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type ModalType = 'signup' | 'verification' | 'personalInfo' | 'success' | 'error' | 'exit' | 'signin' | 'none' | 'forgotPassword' | 'resetPassword';


interface AuthModalState {
  currentModal: ModalType;
  mode: null | 'signup' | 'forgotPassword';
}

const initialState: AuthModalState = {
  currentModal: 'none',
  mode: null,
};


const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    setCurrentModal: (state, action: PayloadAction<ModalType>) => {
      state.currentModal = action.payload;
    },
    closeModal: (state) => {
      state.currentModal = 'none';
    },
    setMode: (state, action: PayloadAction<'signup' | 'forgotPassword'>) => {
      state.mode = action.payload;
    },
  },
});

export const { setCurrentModal, closeModal, setMode } = authModalSlice.actions;
export default authModalSlice;