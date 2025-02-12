import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../store";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  contract?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const getUser = (state: RootState) => state.auth.user;
export const getToken = (state: RootState) => state.auth.token;
export const getUserRole = (state: RootState) => state.auth.user?.role;
export const isAuthenticated = (state: RootState) => !!state.auth.token;

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
