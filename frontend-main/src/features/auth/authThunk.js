import authAPI from "@apis/authAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { sleep } from "@utils/common";
import { toast } from "sonner";
import { resetValueAuth } from "./authSlice";

export const fetchSignUp = createAsyncThunk(
  "auth/fetchSignUp",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await authAPI.post(data, "/sign-up");

      await sleep();

      toast.success(response.message);
      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await authAPI.post(data, "/login");

      await sleep();

      toast.success(response.message);

      return response;
    } catch (error) {
      const message = error?.response?.data.message ?? error?.message;
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await authAPI.get({ params: {}, prefix: "/current-user" });

      toast.success(response.message);

      return response;
    } catch (error) {
      console.log(`error`, error);
      const status = error?.response.status;
      const message = error?.response?.data.message ?? error?.message;

      if (status === 404 || status === 403 || message === "invalid signature") {
        dispatch(fetchLogout());
        return;
      }

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

export const fetchLogout = createAsyncThunk(
  "auth/fetchLogout",
  async (data = null, { rejectWithValue, dispatch }) => {
    try {
      const response = await authAPI.post(null, "/sign-out");

      await sleep();

      toast.success(response.message);

      return response;
    } catch (error) {
      console.log(`error`, error);
      const status = error?.response.status;

      if (status === 404 || status === 403) {
        dispatch(resetValueAuth());
        return;
      }

      const message = error?.response?.data.message ?? error?.message;

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);
