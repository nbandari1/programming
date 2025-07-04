import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
  resetEmail: string | null;
}

const initialState: UserState = {
  user: null,
  resetEmail: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...action.payload };
    },
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return initialState;
    },
    setResetEmail: (state, action: PayloadAction<string | null>) => {
      state.resetEmail = action.payload;
    },
  },
});

export const { setUser, updateUser, clearUser, setResetEmail } = userSlice.actions;
export default userSlice.reducer;
