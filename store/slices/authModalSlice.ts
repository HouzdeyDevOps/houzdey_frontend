import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type ModalType = 'signup' | 'verification' | 'personalInfo' | 'success' | 'error' | 'exit' | 'signin' | 'none';


interface AuthModalState {
  currentModal: ModalType;
}

const initialState: AuthModalState = {
  currentModal: 'none'
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
    }
  },
});

export const { setCurrentModal, closeModal } = authModalSlice.actions;
export default authModalSlice;