import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { fetchCurrentUser, fetchLogin, fetchLogout, fetchSignUp } from "./authThunk";
import { LocalKeys } from "@constant/localStorage";

const initialState = {
  user: null,
  accessToken: localStorage.getItem(LocalKeys.accessToken) ?? null,
  refreshToken: localStorage.getItem(LocalKeys.refreshToken) ?? null,
  userId: localStorage.getItem(LocalKeys.userId) ?? null,
  error: "",
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setValuesRefreshToken: (state, { payload }) => {
      const { userId, tokens } = payload;

      state.userId = userId;
      state.accessToken = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
    },
    resetValueAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;

      localStorage.removeItem(LocalKeys.accessToken);
      localStorage.removeItem(LocalKeys.refreshToken);
      localStorage.removeItem(LocalKeys.userId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSignUp.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchSignUp.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(fetchSignUp.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchLogin.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchLogin.fulfilled, (state, { payload }) => {
      const { userId, tokens } = payload.metadata;

      localStorage.setItem(LocalKeys.accessToken, tokens.accessToken);
      localStorage.setItem(LocalKeys.refreshToken, tokens.refreshToken);
      localStorage.setItem(LocalKeys.userId, userId);

      state.userId = userId;
      state.accessToken = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(fetchLogin.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchCurrentUser.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.user = payload?.metadata;
      state.loading = false;
      state.error = "";
    });
    builder.addCase(fetchCurrentUser.rejected, (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    });

    builder.addCase(fetchLogout.pending, (state, action) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchLogout.fulfilled, (state, { payload }) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;

      localStorage.removeItem(LocalKeys.accessToken);
      localStorage.removeItem(LocalKeys.refreshToken);
      localStorage.removeItem(LocalKeys.userId);

      state.loading = false;
      state.error = "";
    });
    builder.addCase(fetchLogout.rejected, (state, { payload }) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;

      localStorage.removeItem(LocalKeys.accessToken);
      localStorage.removeItem(LocalKeys.refreshToken);
      localStorage.removeItem(LocalKeys.userId);

      state.error = payload;
      state.loading = false;
    });
  },
});

export const { setValuesRefreshToken, resetValueAuth } = authSlice.actions;
export const useAuth = () => useSelector((state) => state.auth);
export default authSlice.reducer;
